import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// get req
export async function GET(req: NextRequest) {
  try {
    const accounts = await prisma.account.findMany({
      include: { children: true },
      orderBy: { id: 'asc' },
    });
    
    return NextResponse.json(accounts);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}

// post req
export async function POST(req: NextRequest) {
  try {
    const { name, is_group, parent_id, companyId } = await req.json();

    const newAccount = await prisma.account.create({
      data: { name, is_group, parent_id, company: { connect: { id: companyId } } },
    });

    return new Response(JSON.stringify(newAccount), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
