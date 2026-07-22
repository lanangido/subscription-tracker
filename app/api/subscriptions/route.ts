import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateStatus } from "@/lib/statusHelper";

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Compute status dynamically
    const processedSubscriptions = subscriptions.map((sub) => ({
      ...sub,
      status: calculateStatus(sub.renewalDate, sub.status),
    }));

    return NextResponse.json(processedSubscriptions);
  } catch (error) {
    console.error("GET /api/subscriptions error:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolName, departmentOwner, renewalDate, monthlyCost, status, notes } = body;

    if (!toolName || !departmentOwner || !renewalDate || monthlyCost === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSubscription = await prisma.subscription.create({
      data: {
        toolName,
        departmentOwner,
        renewalDate: new Date(renewalDate),
        monthlyCost: parseFloat(monthlyCost),
        status: status || "Active",
        notes,
      },
    });

    // Return the newly created subscription but with dynamically calculated status
    // Usually it will match since it was just created, but good practice for consistency
    const result = {
      ...newSubscription,
      status: calculateStatus(newSubscription.renewalDate, newSubscription.status)
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/subscriptions error:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
