// reset-admin.js

const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('Admin@2024!', 12)

  await prisma.user.update({
    where: {
      email: 'mwangig25@gmail.com',
    },
    data: {
      password: hash,
    },
  })

  console.log('Password updated')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())