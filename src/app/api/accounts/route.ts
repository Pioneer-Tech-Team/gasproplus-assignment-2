import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// get req
export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId');
    let query: any = {
      include: { children: true },
      orderBy: { id: 'asc' },
    };
    if (companyId) {
      query.where = { company_id: parseInt(companyId, 10) };
    }
    const accounts = await prisma.account.findMany(query);
    
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
    const { name, is_group, parent, companyId } = await req.json();

    // Creating a new account using 'parent' instead of 'parent_id'
    const newAccount = await prisma.account.create({
      data: {
        name,
        is_group,
        parent: parent ? { connect: { id: parent } } : undefined, // Connect to parent if it's provided
        company: { connect: { id: companyId } }, // Connect to the company
      },
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
