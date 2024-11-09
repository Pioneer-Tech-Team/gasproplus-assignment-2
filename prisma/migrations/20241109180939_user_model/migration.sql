-- CreateEnum
CREATE TYPE "RelationshipEnum" AS ENUM ('one_to_one', 'one_to_many', 'many_to_one', 'many_to_many');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherType" (
    "id" SERIAL NOT NULL,
    "shortForm" VARCHAR(4) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "drFilter" VARCHAR(1024),
    "crFilter" VARCHAR(1024),
    "relationship" "RelationshipEnum" NOT NULL,
    "manyDr" BOOLEAN NOT NULL,
    "manyCr" BOOLEAN NOT NULL,

    CONSTRAINT "VoucherType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" SERIAL NOT NULL,
    "voucherNo" INTEGER NOT NULL,
    "voucherDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "narration" VARCHAR(255),
    "voucherTypeId" INTEGER NOT NULL,
    "companyId" INTEGER,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherDetail" (
    "id" SERIAL NOT NULL,
    "voucherId" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "drcr" INTEGER NOT NULL,
    "remark" VARCHAR(30),

    CONSTRAINT "VoucherDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherNos" (
    "series" VARCHAR(12) NOT NULL,
    "lastNo" INTEGER NOT NULL,

    CONSTRAINT "VoucherNos_pkey" PRIMARY KEY ("series")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "VoucherType_shortForm_key" ON "VoucherType"("shortForm");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_voucherNo_key" ON "Voucher"("voucherNo");

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_voucherTypeId_fkey" FOREIGN KEY ("voucherTypeId") REFERENCES "VoucherType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherDetail" ADD CONSTRAINT "VoucherDetail_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
