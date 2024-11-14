import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST Endpoint: Adds details to an existing voucher
export async function POST(req: NextRequest) {
  try {
    const { voucherId, details } = await req.json();
    
    const parsedVoucherId = parseInt(voucherId, 10); // Convert voucherId to an integer
    if (isNaN(parsedVoucherId)) {
      return new Response(
        JSON.stringify({ error: "Invalid voucherId" }),
        { status: 400 }
      );
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
        const accountId = parseInt(detail.accountId, 10); // Convert accountId to an integer
        if (isNaN(accountId)) {
          return new Response(
            JSON.stringify({ error: `Invalid accountId ${detail.accountId}` }),
            { status: 400 }
          );
        }

        const account = await prisma.account.findUnique({
          where: { id: accountId }, // Use the integer accountId here
        });

        if (!account) {
          return new Response(
            JSON.stringify({ error: `Invalid accountId ${detail.accountId}` }),
            { status: 400 }
          );
        }
      }
    }

    // Create new details for the voucher
    const createdDetails = await prisma.voucherDetail.createMany({
      data: details.map((detail: any) => ({
        voucherId: parsedVoucherId,  // Use the parsedVoucherId here
        amount: parseFloat(detail.amount), // Assuming amount is a string, convert to number
        drcr: parseInt(detail.drcr),
        remark: detail.remark,
        accountId: parseInt(detail.accountId, 10), // Convert accountId to number
      })),
    });

    return NextResponse.json(createdDetails, { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}

  
  // GET Endpoint: Retrieves details of a voucher (based on voucherId)
export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const voucherIdParam = searchParams.get("voucherId");
      const voucherId = voucherIdParam ? parseInt(voucherIdParam, 10) : null;
      console.log(searchParams);
  
      // Fetch the voucher details along with associated accounts
      const voucherDetails = await prisma.voucherDetail.findMany({
        where: { voucherId: voucherId ?? undefined },
        include: {
          account: true, // Include account details for each voucher detail
        },
      });
  
      if (!voucherDetails || voucherDetails.length === 0) {
        return new Response(
          JSON.stringify({ error: "No details found for the given voucher" }),
          { status: 404 }
        );
      }
  
      return NextResponse.json(voucherDetails);
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
      });
    }
  }
  