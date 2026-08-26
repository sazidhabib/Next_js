import { NextResponse } from "next/server";
import { Order, Font } from "../../../models/index.js";

export async function GET() {
  const orders = await Order.findAll({
    include: [{ model: Font, as: "font", attributes: ["name"] }],
    order: [["createdAt", "DESC"]],
  });
  return NextResponse.json({ orders });
}
