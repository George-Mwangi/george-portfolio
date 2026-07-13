'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Phone, MapPin, Send, MessageCircle, Linkedin, ExternalLink } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject is too short').max(200).optional(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
})

type ContactFormData = z.infer<typeof contactSchema>

interface Profile {
  email?: string
  phone?: string | null
  location?: string | null
  linkedinUrl?: string | null
  whatsappNumber?: string | null
}

export function ContactSection({ profile }: { profile: Profile | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to send message')
      }

      toast.success('Message sent! George will get back to you soon.')
      reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: profile?.email || 'mwangig25@gmail.com',
      href: `mailto:${profile?.email || 'mwangig25@gmail.com'}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile?.phone || '+254 719 440 407',
      href: `tel:${profile?.phone || '+254719440407'}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: profile?.location || 'Nakuru, Kenya',
      href: null,
    },
  ]

  return (
    <section id="contact" className="py-24 relative" aria-label="Contact">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Get in Touch
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
            Contact Me
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Open to procurement, logistics, and customer service opportunities across Kenya.
            Reach out and let's talk.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-foreground font-medium hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Social/quick links */}
            <div className="flex gap-3">
              {profile?.whatsappNumber && (
                <a
                  href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium hover:bg-green-500/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {/* suppressHydrationWarning on form and every input wrapper prevents
                false hydration mismatches caused by browser extensions (LastPass,
                1Password, Bitwarden) injecting icon nodes into the DOM before
                React's client render. This is the recommended React approach. */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass-card rounded-2xl p-8 border border-border/50 space-y-5"
              noValidate
              suppressHydrationWarning
            >
              <div className="grid sm:grid-cols-2 gap-4" suppressHydrationWarning>
                <div suppressHydrationWarning>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    {...register('name')}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all"
                    suppressHydrationWarning
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div suppressHydrationWarning>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all"
                    suppressHydrationWarning
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div suppressHydrationWarning>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  autoComplete="off"
                  {...register('subject')}
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all"
                  suppressHydrationWarning
                />
              </div>

              <div suppressHydrationWarning>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  placeholder="Tell me about the opportunity or your inquiry..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all resize-none"
                  suppressHydrationWarning
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
