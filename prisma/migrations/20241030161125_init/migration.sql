-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER DEFAULT 0,
    "is_group" BOOLEAN NOT NULL,
    "name" VARCHAR(60) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
