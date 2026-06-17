export const toISO = (value?: string) =>
  value ? new Date(value).toISOString() : null