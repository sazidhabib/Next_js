import { NextResponse } from "next/server";
import { initDB, Post, PostDelivery } from "@/lib/db";
import { retryDelivery } from "@/lib/queue/publisher";

export async function POST(req, { params }) {
  try {
    const { id: postId } = await params;
    const body = await req.json().catch(() => ({}));
    const { deliveryId } = body;

    const dbStatus = await initDB();

    if (dbStatus.isConnected) {
      if (deliveryId) {
        const result = await retryDelivery(deliveryId);
        return NextResponse.json({ success: true, result });
      }

      // Retry all failed deliveries for the post
      const failedDeliveries = await PostDelivery.findAll({
        where: { post_id: postId, status: "failed" },
      });

      const results = await Promise.allSettled(
        failedDeliveries.map((del) => retryDelivery(del.id))
      );

      return NextResponse.json({ success: true, count: failedDeliveries.length, results });
    }

    // In-memory simulation fallback
    return NextResponse.json({
      success: true,
      message: "Delivery re-queued successfully.",
      simulated: true,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
