/**
 * Reset admin password without re-seeding all data.
 * Usage:  npx tsx scripts/reset-password.ts
 * Or set a custom password:  ADMIN_PASSWORD=MyNewPass123 npx tsx scripts/reset-password.ts
 */
import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = createHash('sha256').update(Date.now().toString() + Math.random().toString()).digest('hex').slice(0, 16)
  const hash = createHash('sha256').update(salt + password).digest('hex')
  return `sha256:${salt}:${hash}`
}

async function main() {
  const email    = process.env.ADMIN_EMAIL    || 'mwangig25@gmail.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin@2024!'

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`❌ No user found with email: ${email}`)
    console.log('Run npm run db:seed first.')
    process.exit(1)
  }

  await prisma.user.update({
    where: { email },
    data: { password: hashPassword(password) },
  })

  console.log('✅ Password reset successfully')
  console.log('   Email:   ', email)
  console.log('   Password:', password)
}

main().catch(console.error).finally(() => prisma.$disconnect())
