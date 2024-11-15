-- AlterTable
CREATE SEQUENCE vouchernos_lastno_seq;
ALTER TABLE "VoucherNos" ALTER COLUMN "lastNo" DROP NOT NULL,
ALTER COLUMN "lastNo" SET DEFAULT nextval('vouchernos_lastno_seq');
ALTER SEQUENCE vouchernos_lastno_seq OWNED BY "VoucherNos"."lastNo";
