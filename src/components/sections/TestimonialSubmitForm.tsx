'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, Send, MessageSquarePlus, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  authorName:    z.string().min(2, 'Name is required').max(100),
  authorTitle:   z.string().max(100).optional(),
  authorCompany: z.string().max(100).optional(),
  content:       z.string().min(20, 'Please write at least 20 characters').max(1000),
  rating:        z.number().min(1).max(5),
})
type FormData = z.infer<typeof schema>

export function TestimonialSubmitForm() {
  const [submitted, setSubmitted] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  })

  const rating = watch('rating')

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      toast.error('Failed to submit. Please try again.')
    }
  }

  if (submitted) {
    return (
      <section className="py-24" aria-label="Testimonial submitted">
        <div className="section-container max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">Thank you!</h3>
            <p className="text-muted-foreground">Your testimonial has been submitted and will appear after admin review.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-muted/20" aria-label="Leave a testimonial">
      <div className="section-container max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageSquarePlus className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">Leave a Testimonial</h2>
          <p className="text-muted-foreground">Worked with George? Share your experience — it will appear here after review.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-7 border border-border/50 space-y-5" noValidate suppressHydrationWarning>

            {/* Star rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Your Rating</label>
              <div className="flex gap-1.5" role="group" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setValue('rating', star)}
                    aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-muted-foreground/30'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4" suppressHydrationWarning>
              <div suppressHydrationWarning>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Name <span className="text-primary">*</span></label>
                <input {...register('authorName')} placeholder="Jane Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none text-sm transition-all"
                  suppressHydrationWarning />
                {errors.authorName && <p className="mt-1 text-xs text-destructive">{errors.authorName.message}</p>}
              </div>
              <div suppressHydrationWarning>
                <label className="block text-sm font-medium text-foreground mb-1.5">Job Title</label>
                <input {...register('authorTitle')} placeholder="IT Professional"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none text-sm transition-all"
                  suppressHydrationWarning />
              </div>
            </div>

            <div suppressHydrationWarning>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company / Organisation</label>
              <input {...register('authorCompany')} placeholder="Acme Ltd"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none text-sm transition-all"
                suppressHydrationWarning />
            </div>

            <div suppressHydrationWarning>
              <label className="block text-sm font-medium text-foreground mb-1.5">Your Testimonial <span className="text-primary">*</span></label>
              <textarea {...register('content')} rows={5} placeholder="Share your experience working with George..."
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none text-sm transition-all resize-none"
                suppressHydrationWarning />
              {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>}
            </div>

            <p className="text-xs text-muted-foreground">
              Your testimonial will be reviewed before appearing publicly. No spam or irrelevant content.
            </p>

            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-60">
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                : <Send className="w-4 h-4" />}
              {isSubmitting ? 'Submitting…' : 'Submit Testimonial'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
