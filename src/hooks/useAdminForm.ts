'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

type Config<T> = {
  baseUrl: string
  initialData: T[]
  normalize?: (form: any) => any
  validate?: (form: any) => string | null
}

export function useAdminForm<T extends { id?: string }>(config: Config<T>) {
  const { baseUrl, initialData, normalize, validate } = config

  const [items, setItems] = useState<T[]>(initialData)
  const [form, setForm] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const openNew = (empty: any) => setForm({ ...empty })

  const openEdit = (item: any, transform?: (i: any) => any) => {
    setForm(transform ? transform(item) : item)
  }

  const closeForm = () => setForm(null)

  const save = async () => {
    if (!form) return

    const error = validate?.(form)
    if (error) {
      toast.error(error)
      return
    }

    setSaving(true)

    try {
      const isEdit = !!form.id

      const payload = normalize ? normalize(form) : form

      const res = await fetch(
        isEdit ? `${baseUrl}/${form.id}` : baseUrl,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw new Error()

      const saved = await res.json()

      setItems((prev) =>
        isEdit
          ? prev.map((i) => (i.id === saved.id ? saved : i))
          : [saved, ...prev]
      )

      toast.success(isEdit ? 'Updated' : 'Added')
      setForm(null)
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Are you sure?')) return

    setDeleting(id)

    try {
      await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      })

      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return {
    items,
    setItems,
    form,
    setForm,
    openNew,
    openEdit,
    closeForm,
    save,
    remove,
    saving,
    deleting,
  }
}