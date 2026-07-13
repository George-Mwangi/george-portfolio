import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit, sanitizeInput } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200).optional(),
  message: z.string().min(20).max(2000),
})

export async function POST(req: NextRequest) {
  // Rate limiting: 5 submissions per 15 minutes per IP
  const { success } = rateLimit(req, { limit: 5, windowMs: 15 * 60 * 1000 })
  if (!success) {
    return NextResponse.json(
      { message: 'Too many requests. Please wait before trying again.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = parsed.data

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        subject: subject ? sanitizeInput(subject) : null,
        message: sanitizeInput(message),
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    // Send email notification if configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = await import('nodemailer')
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_EMAIL || 'mwangig25@gmail.com',
          subject: `New Contact Message: ${subject || 'No subject'} – from ${name}`,
          html: `
            <h2>New message from your portfolio</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
            <p><strong>Message:</strong></p>
            <blockquote>${message.replace(/\n/g, '<br>')}</blockquote>
          `,
          replyTo: email,
        })
      } catch (emailErr) {
        console.error('Email notification failed (non-critical):', emailErr)
      }
    }

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
