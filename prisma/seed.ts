import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  
  // Clear existing records
  await prisma.subscription.deleteMany({})

  const today = new Date();

  // Create dates for testing different statuses
  const pastDate = new Date(today);
  pastDate.setDate(pastDate.getDate() - 10); // Expired

  const expiringSoonDate1 = new Date(today);
  expiringSoonDate1.setDate(expiringSoonDate1.getDate() + 2); // Expiring Soon

  const expiringSoonDate2 = new Date(today);
  expiringSoonDate2.setDate(expiringSoonDate2.getDate() + 6); // Expiring Soon

  const futureDate1 = new Date(today);
  futureDate1.setDate(futureDate1.getDate() + 30); // Active

  const futureDate2 = new Date(today);
  futureDate2.setDate(futureDate2.getDate() + 90); // Active
  
  const futureDate3 = new Date(today);
  futureDate3.setDate(futureDate3.getDate() + 15); // Active

  const seedData = [
    {
      toolName: 'Slack',
      departmentOwner: 'Engineering',
      renewalDate: futureDate1,
      monthlyCost: 250.00,
      status: 'Active',
      notes: 'Company-wide communication tool',
    },
    {
      toolName: 'Zoom',
      departmentOwner: 'HR',
      renewalDate: expiringSoonDate1,
      monthlyCost: 150.00,
      status: 'Active', 
      // Seed script provides "Active" but it will be evaluated as "Expiring Soon" in UI or upon fetch.
      // Wait, the prompt says "Status dihitung otomatis berdasarkan renewalDate saat data ditampilkan". 
      // But we can store what it naturally is at seed time to avoid confusion.
      notes: 'Video conferencing licenses for all teams',
    },
    {
      toolName: 'Canva',
      departmentOwner: 'Marketing',
      renewalDate: futureDate2,
      monthlyCost: 120.00,
      status: 'Active',
      notes: 'Design assets and templates',
    },
    {
      toolName: 'Google Workspace',
      departmentOwner: 'IT',
      renewalDate: expiringSoonDate2,
      monthlyCost: 800.00,
      status: 'Active',
      notes: 'Email, Docs, Drive for organization',
    },
    {
      toolName: 'Figma',
      departmentOwner: 'Design',
      renewalDate: pastDate,
      monthlyCost: 450.00,
      status: 'Expired',
      notes: 'UI/UX design tool, need to renew ASAP',
    },
    {
      toolName: 'AWS',
      departmentOwner: 'Engineering',
      renewalDate: futureDate3,
      monthlyCost: 1250.00,
      status: 'Active',
      notes: 'Cloud infrastructure hosting',
    },
    {
      toolName: 'Notion',
      departmentOwner: 'Product',
      renewalDate: pastDate,
      monthlyCost: 300.00,
      status: 'Cancelled',
      notes: 'Migrated to Confluence, cancelled last month.',
    },
    {
      toolName: 'Jira',
      departmentOwner: 'Engineering',
      renewalDate: futureDate1,
      monthlyCost: 600.00,
      status: 'Active',
      notes: 'Issue and project tracking',
    },
    {
      toolName: 'GitHub Enterprise',
      departmentOwner: 'Engineering',
      renewalDate: futureDate2,
      monthlyCost: 950.00,
      status: 'Active',
      notes: 'Source code management',
    },
    {
      toolName: 'Vercel',
      departmentOwner: 'Engineering',
      renewalDate: pastDate,
      monthlyCost: 150.00,
      status: 'Expired',
      notes: 'Frontend deployment',
    }
  ];

  for (const s of seedData) {
    const sub = await prisma.subscription.create({
      data: s,
    })
    console.log(`Created subscription with id: ${sub.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
