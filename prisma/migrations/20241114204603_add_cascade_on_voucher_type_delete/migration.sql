-- DropForeignKey
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_voucherTypeId_fkey";

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_voucherTypeId_fkey" FOREIGN KEY ("voucherTypeId") REFERENCES "VoucherType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
