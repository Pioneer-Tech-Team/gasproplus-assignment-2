import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// get all acc
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const account = await prisma.account.findUnique({
    where: { id: Number(id) },
    include: { children: true },
  });
  res.json(account);
}

// update by id {WIP}
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { name, is_group, parent_id } = req.body;
  const updatedAccount = await prisma.account.update({
    where: { id: Number(id) },
    data: { name, is_group, parent_id },
  });
  res.json(updatedAccount);
}

// del by id
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await prisma.account.delete({
    where: { id: Number(id) },
  });
  res.status(204).end();
}
