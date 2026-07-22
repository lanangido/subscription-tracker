import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateStatus } from "@/lib/statusHelper";

export async function PUT(request: Request, ctx: RouteContext<'/api/subscriptions/[id]'>) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { toolName, departmentOwner, renewalDate, monthlyCost, status, notes } = body;

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        toolName,
        departmentOwner,
        renewalDate: new Date(renewalDate),
        monthlyCost: parseFloat(monthlyCost),
        status,
        notes,
      },
    });

    return NextResponse.json({
      ...updated,
      status: calculateStatus(updated.renewalDate, updated.status),
    });
  } catch (error) {
    console.error("PUT /api/subscriptions/[id] error:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: RouteContext<'/api/subscriptions/[id]'>) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    // Use for quick status toggling (e.g. manually setting Cancelled or restoring)
    const { status } = body;

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      ...updated,
      status: calculateStatus(updated.renewalDate, updated.status),
    });
  } catch (error) {
    console.error("PATCH /api/subscriptions/[id] error:", error);
    return NextResponse.json({ error: "Failed to update subscription status" }, { status: 500 });
  }
}

export async function DELETE(request: Request, ctx: RouteContext<'/api/subscriptions/[id]'>) {
  try {
    const { id } = await ctx.params;
    await prisma.subscription.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/subscriptions/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
