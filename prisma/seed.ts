import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.account.createMany({
    data: [
      { parent_id: null, is_group: true, name: "Assets" },
      { parent_id: null, is_group: true, name: "Liability" },
      { parent_id: null, is_group: true, name: "Income" },
      { parent_id: null, is_group: true, name: "Expenses" },
      { parent_id: 1, is_group: false, name: "Cash" },
      { parent_id: 1, is_group: true, name: "Bank" },
      { parent_id: 6, is_group: false, name: "Bank of India" },
      { parent_id: 6, is_group: false, name: "ICICI" },
      { parent_id: 6, is_group: false, name: "HDFC" },
      { parent_id: 2, is_group: true, name: "Loans" },
      { parent_id: 10, is_group: true, name: "Bank Loans" },
      {
        parent_id: 11,
        is_group: false,
        name: "Bank of Baroda A/c no 24136589",
      },
      {
        parent_id: 11,
        is_group: false,
        name: "ICICI Bank A/c no 334968531666",
      },
    ],
  });
}

main()
  .then(() => console.log("Data seeded sucessfully"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
