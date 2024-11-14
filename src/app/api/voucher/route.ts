import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET Endpoint: Retrieves all vouchers with associated data
export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: {
        voucherType: true,
        company: true,
        details: {
          include: {
            account: true, // Includes associated account for each voucher detail
            voucher: true, // Includes associated voucher for each voucher detail
          },
        },
      },
    });
    return NextResponse.json(vouchers);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      voucherNo,
      voucherDate,
      amount,
      narration,
      voucherTypeId,
      companyId,
      details = [],  // Optional field, can be empty or undefined
    } = await req.json();


    // Validate voucherTypeId
    const voucherType = await prisma.voucherType.findUnique({
      where: { id: voucherTypeId },
    });
    if (!voucherType) {
      return new Response(JSON.stringify({ error: "Invalid voucherTypeId" }), {
        status: 400,
      });
    }

    // Validate companyId
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      return new Response(JSON.stringify({ error: "Invalid companyId" }), {
        status: 400,
      });
    }


    // Create the voucher, but don't include details at this stage
    const newVoucher = await prisma.voucher.create({
      data: {
        voucherNo,
        voucherDate: new Date(voucherDate),
        amount,
        narration,
        voucherTypeId,
        companyId,
      },
    });

    console.log("Voucher created without details", newVoucher);

    // Return the created voucher (without details)
    return NextResponse.json(newVoucher, { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}


// PUT Endpoint: Updates an existing voucher with new details and associated accounts
export async function PUT(req: NextRequest) {
  try {
    const {
      id,
      voucherNo,
      voucherDate,
      amount,
      narration,
      voucherTypeId,
      companyId,
      details, // Array of voucher detail objects, each with accountId
    } = await req.json();

    // Validate voucherTypeId
    const voucherType = await prisma.voucherType.findUnique({
      where: { id: voucherTypeId },
    });
    if (!voucherType) {
      return new Response(JSON.stringify({ error: "Invalid voucherTypeId" }), {
        status: 400,
      });
    }

    // Validate companyId
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      return new Response(JSON.stringify({ error: "Invalid companyId" }), {
        status: 400,
      });
    }

    // Ensure details is an array and has valid data
    if (!Array.isArray(details)) {
      return new Response(
        JSON.stringify({ error: "Details should be an array" }),
        { status: 400 }
      );
    }

    // Validate accountIds in details
    for (const detail of details) {
      if (detail.accountId) {
        const account = await prisma.account.findUnique({
          where: { id: detail.accountId },
        });
        if (!account) {
          return new Response(
            JSON.stringify({ error: `Invalid accountId ${detail.accountId}` }),
            { status: 400 }
          );
        }
      }
    }

    const updatedVoucher = await prisma.voucher.update({
      where: { id },
      data: {
        voucherNo,
        voucherDate: new Date(voucherDate),
        amount,
        narration,
        voucherTypeId,
        companyId,
        details: {
          deleteMany: { voucherId: id }, // Clear existing details
          create: details.map((detail: any) => ({
            amount: detail.amount,
            drcr: detail.drcr,
            remark: detail.remark,
            accountId: detail.accountId,
          })),
        },
      },
      include: {
        details: {
          include: {
            account: true,
          },
        },
      },
    });

    return NextResponse.json(updatedVoucher);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}


// DELETE Endpoint: Deletes a voucher and associated details
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    // Delete related VoucherDetail entries
    await prisma.voucherDetail.deleteMany({
      where: { voucherId: id },
    });

    // Delete Voucher
    await prisma.voucher.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
