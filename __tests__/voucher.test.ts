import request from 'supertest';
import app from '@/appw';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.voucher.deleteMany();
  await prisma.voucherType.deleteMany();
  await prisma.company.deleteMany();
  await prisma.voucherType.create({
    data: {
      id: 1,
      name: 'Purchase',
      shortForm: 'PUR',
      relationship: 'one_to_many',
      manyDr: false,
      manyCr: false,
    },
  });
  await prisma.company.create({
    data: {
      id: 1,
      name: 'Company 1',
      ownerId: 1,
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Voucher API', () => {
  it('should create a new voucher', async () => {
    const response = await request(app)
      .post('/api/voucher')
      .send({
        voucherNo: 1002,
        voucherDate: '2024-11-12T12:00:00Z',
        amount: 1200.75,
        narration: 'Office equipment',
        voucherTypeId: 1,
        companyId: 1,
        details: [
          { amount: 700.00, drcr: 1, remark: 'Desk purchase' },
          { amount: 500.75, drcr: -1, remark: 'Credit for chair' },
        ],
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.amount).toBe(1200.75);
  });

  it('should return all vouchers', async () => {
    const response = await request(app).get('/api/voucher');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update an existing voucher', async () => {
    const response = await request(app)
      .put('/api/voucher')
      .send({
        id: 1, // Replace with an actual ID from your DB or test setup
        voucherNo: 1003,
        voucherDate: '2024-11-15T12:00:00Z',
        amount: 1500.00,
        narration: 'Updated purchase',
        voucherTypeId: 1,
        companyId: 1,
        details: [
          { amount: 800.00, drcr: 1, remark: 'Updated desk' },
          { amount: 700.00, drcr: -1, remark: 'Updated credit' },
        ],
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.narration).toBe('Updated purchase');
  });

  it('should delete a voucher', async () => {
    const response = await request(app)
      .delete('/api/voucher')
      .send({ id: 1 }) // Replace with an actual ID
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(204);
  });
});
function beforeAll(arg0: () => Promise<void>) {
    throw new Error('Function not implemented.');
}

