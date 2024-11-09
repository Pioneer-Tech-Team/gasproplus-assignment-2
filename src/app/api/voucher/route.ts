import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: {
        voucherType: true,
        company: true,
        details: true,
      },
    });
    return NextResponse.json(vouchers);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
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
      details, //voucher detail objects
    } = await req.json();

    //checkif voucherTypeId exist
    const voucherType = await prisma.voucherType.findUnique({
      where: { id: voucherTypeId },
    });

    if (!voucherType) {
      return new Response(
        JSON.stringify({ error: "Invalid voucherTypeId" }),
        { status: 400 }
      );
    }

    const newVoucher = await prisma.voucher.create({
      data: {
        voucherNo,
        voucherDate: new Date(voucherDate),
        amount,
        narration,
        voucherTypeId,
        companyId,
        details: {
          create: details,
        },
      },
      include: {
        details: true,
      },
    });

    return NextResponse.json(newVoucher, { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}


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
      details,
    } = await req.json();

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
          deleteMany: {}, // existing details delete
          create: details,
        },
      },
      include: {
        details: true,
      },
    });

    return NextResponse.json(updatedVoucher);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.voucher.delete({
      where: { id },
    });

    return new Response(null, { status: 204 }); 
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}
