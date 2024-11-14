import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed VoucherType data
  await prisma.voucherType.createMany({
    data: [
      { shortForm: "JV", name: "Journal Voucher", relationship: "one_to_one", manyDr: true, manyCr: true },
      { shortForm: "PV", name: "Payment Voucher", relationship: "one_to_many", manyDr: false, manyCr: true },
    ],
    skipDuplicates: true, // Skip if the entry already exists
  });

  // Seed Company data
  await prisma.company.createMany({
    data: [
      { name: "Tech Corp" },
      { name: "Business Solutions" },
    ],
    skipDuplicates: true,
  });

  // Seed Account data (commented by default; uncomment if needed)
  
  await prisma.account.createMany({
    data: [
      { parent_id: null, is_group: true, name: "Assets", companyId: 1 },
      { parent_id: null, is_group: true, name: "Liability", companyId: 1 },
      { parent_id: null, is_group: true, name: "Income", companyId: 1 },
      { parent_id: null, is_group: true, name: "Expenses", companyId: 1 },
      { parent_id: 1, is_group: false, name: "Cash", companyId: 1 },
      { parent_id: 1, is_group: true, name: "Bank", companyId: 1 },
      { parent_id: 6, is_group: false, name: "Bank of India", companyId: 1 },
      { parent_id: 6, is_group: false, name: "ICICI", companyId: 1 },
      { parent_id: 6, is_group: false, name: "HDFC", companyId: 1 },
      { parent_id: 2, is_group: true, name: "Loans", companyId: 1 },
      { parent_id: 10, is_group: true, name: "Bank Loans", companyId: 1 },
      {
        parent_id: 11,
        is_group: false,
        name: "Bank of Baroda A/c no 24136589",
        companyId: 1,
      },
      {
        parent_id: 11,
        is_group: false,
        name: "ICICI Bank A/c no 334968531666",
        companyId: 1,
      },
    ],
    skipDuplicates: true,
  });
  
}

main()
  .then(() => console.log("Data seeded successfully"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
