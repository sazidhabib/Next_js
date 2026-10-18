import { NextResponse } from "next/server";
import { initDB, SocialAccount, User } from "@/lib/db";
import { getSupportedProviders } from "@/lib/social/registry";

// In-memory demo fallback store if MySQL is not configured yet
let mockAccounts = [
  {
    id: "acc_li_1",
    provider: "linkedin",
    account_name: "John Doe (LinkedIn)",
    account_id: "urn:li:person:johndoe",
    is_active: true,
    metadata: {
      picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      handle: "johndoe-official",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc_meta_fb",
    provider: "facebook",
    account_name: "TechPulse Page (Facebook)",
    account_id: "109823471829",
    is_active: true,
    metadata: {
      picture: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      handle: "@TechPulseHQ",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc_meta_ig",
    provider: "instagram",
    account_name: "TechPulse Official (Instagram)",
    account_id: "1784140582928",
    is_active: true,
    metadata: {
      picture: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      handle: "@techpulse.app",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc_tw_1",
    provider: "twitter",
    account_name: "@TechPulseHQ (X)",
    account_id: "tw_98234129",
    is_active: true,
    metadata: {
      picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      handle: "@TechPulseHQ",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "acc_yt_1",
    provider: "youtube",
    account_name: "TechPulse Media (YouTube)",
    account_id: "UC_x98234091823",
    is_active: true,
    metadata: {
      picture: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      handle: "@TechPulseChannel",
    },
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  const dbStatus = await initDB();
  const supportedProviders = getSupportedProviders();

  if (dbStatus.isConnected) {
    try {
      const accounts = await SocialAccount.findAll({
        attributes: ["id", "provider", "account_name", "account_id", "is_active", "metadata", "created_at"],
        order: [["created_at", "DESC"]],
      });

      return NextResponse.json({
        success: true,
        databaseConnected: true,
        supportedProviders,
        accounts: accounts.length > 0 ? accounts : mockAccounts,
      });
    } catch (err) {
      console.warn("DB accounts query fallback:", err.message);
    }
  }

  // Graceful fallback for local dev before MySQL credentials are set
  return NextResponse.json({
    success: true,
    databaseConnected: false,
    supportedProviders,
    accounts: mockAccounts,
    note: "Serving accounts with simulated active connections for immediate testing.",
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { provider, accountName, accountId, metadata } = body;

    const dbStatus = await initDB();

    if (dbStatus.isConnected) {
      // Find or create default demo user
      let [defaultUser] = await User.findOrCreate({
        where: { email: "demo@antigravity.dev" },
        defaults: { name: "Demo User", password_hash: "demo_hash" },
      });

      const newAccount = await SocialAccount.create({
        user_id: defaultUser.id,
        provider,
        account_name: accountName || `${provider} Account`,
        account_id: accountId || `id_${Date.now()}`,
        encrypted_access_token: "mock_token_" + Date.now(),
        metadata: metadata || {},
        is_active: true,
      });

      return NextResponse.json({ success: true, account: newAccount });
    }

    // In-memory fallback
    const newMock = {
      id: "acc_" + Date.now(),
      provider,
      account_name: accountName || `${provider} Account`,
      account_id: accountId || `id_${Date.now()}`,
      is_active: true,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    };
    mockAccounts.push(newMock);

    return NextResponse.json({ success: true, account: newMock });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
