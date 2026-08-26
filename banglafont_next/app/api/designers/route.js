import { NextResponse } from "next/server";
import { Designer, Font } from "../../../models/index.js";

export async function GET() {
  const designers = await Designer.findAll({
    include: [{ model: Font, as: "fonts", attributes: ["id"] }],
    order: [["name", "ASC"]],
  });

  const formatted = designers.map((d) => {
    const plain = d.toJSON();
    return {
      ...plain,
      _count: { fonts: plain.fonts ? plain.fonts.length : 0 },
    };
  });

  return NextResponse.json({ designers: formatted });
}
