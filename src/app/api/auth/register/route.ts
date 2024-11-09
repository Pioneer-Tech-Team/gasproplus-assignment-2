import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'asdf';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Username already exists' }), { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    console.log('User created:', newUser);
    return NextResponse.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}
