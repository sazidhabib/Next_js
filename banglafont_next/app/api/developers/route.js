import { NextResponse } from "next/server";
import { Developer, Font } from "../../../models/index.js";

export async function GET() {
  const developers = await Developer.findAll({
    include: [{ model: Font, as: "fonts", attributes: ["id"] }],
    order: [["name", "ASC"]],
  });

  const formatted = developers.map((d) => {
    const plain = d.toJSON();
    return {
      ...plain,
      _count: { fonts: plain.fonts ? plain.fonts.length : 0 },
    };
  });

  return NextResponse.json({ developers: formatted });
}
