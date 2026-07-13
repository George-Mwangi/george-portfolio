'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  description: z.string().optional(),
  achievements: z.string().optional(),
  location: z.string().optional(),
  order: z.coerce.number().default(0),
  isPublished: z.boolean(),
})

type FormValues = z.input<typeof experienceSchema>

interface Props {
  experience?: any
  onSaved: (experience: any) => void
  onCancel: () => void
}

export function ExperienceForm({
  experience,
  onSaved,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: '',
      location: '',
      order: 0,
      isPublished: true,
    },
  })

  useEffect(() => {
    if (experience) {
      reset({
        company: experience.company,
        role: experience.role,
        startDate: experience.startDate?.slice(0, 10),
        endDate: experience.endDate?.slice(0, 10) || '',
        isCurrent: experience.isCurrent,
        description: experience.description || '',
        achievements: experience.achievements?.join('\n') || '',
        location: experience.location || '',
        order: experience.order,
        isPublished: experience.isPublished,
      })
    }
  }, [experience, reset])

  const isCurrent = watch('isCurrent')

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        ...values,
        achievements: values.achievements
          ? values.achievements
              .split('\n')
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
        endDate: values.isCurrent ? null : values.endDate,
      }

      const url = experience
        ? `/api/admin/experience/${experience.id}`
        : '/api/admin/experience'

      const method = experience ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok)
        throw new Error('Failed to save')

      const saved = await res.json()

      toast.success(
        experience
          ? 'Experience updated'
          : 'Experience added'
      )

      onSaved(saved)
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label>Role</label>
        <input
          {...register('role')}
          className="w-full border rounded-lg p-2"
        />
        {errors.role && (
          <p className="text-red-500 text-sm">
            {errors.role.message}
          </p>
        )}
      </div>

      <div>
        <label>Company</label>
        <input
          {...register('company')}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <label>Location</label>
        <input
          {...register('location')}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Start Date</label>
          <input
            type="date"
            {...register('startDate')}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            type="date"
            disabled={isCurrent}
            {...register('endDate')}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          {...register('isCurrent')}
        />
        Current Position
      </label>

      <div>
        <label>Description</label>
        <textarea
          rows={4}
          {...register('description')}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <label>
          Achievements
          <span className="text-xs text-muted-foreground">
            {' '}
            (one per line)
          </span>
        </label>

        <textarea
          rows={5}
          {...register('achievements')}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <label>Display Order</label>
        <input
          type="number"
          {...register('order')}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          {...register('isPublished')}
        />
        Published
      </label>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
        >
          {isSubmitting
            ? 'Saving...'
            : experience
            ? 'Update Experience'
            : 'Add Experience'}
        </button>
      </div>
    </form>
  )}