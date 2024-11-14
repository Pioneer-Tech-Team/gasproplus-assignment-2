import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const {
      shortForm,
      name,
      drFilter,
      crFilter,
      relationship,
      manyDr,
      manyCr,
    } = await req.json();

    const newVoucherType = await prisma.voucherType.create({
      data: {
        shortForm,
        name,
        drFilter,
        crFilter,
        relationship,
        manyDr,
        manyCr,
      },
    });

    return NextResponse.json(newVoucherType, { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const voucherTypes = await prisma.voucherType.findMany();
    return NextResponse.json(voucherTypes);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  const { id, shortForm, name, drFilter, crFilter, relationship, manyDr, manyCr } = await req.json();

  try {
    const updatedVoucherType = await prisma.voucherType.update({
      where: {
        id: Number(id),
      },
      data: {
        shortForm,
        name,
        drFilter,
        crFilter,
        relationship,
        manyDr,
        manyCr,
      },
    });

    return NextResponse.json(updatedVoucherType);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    // First delete the related vouchers
    await prisma.voucher.deleteMany({
      where: { voucherTypeId: Number(id) },
    });

    // Then delete the voucher type
    await prisma.voucherType.delete({
      where: { id: Number(id) },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}

