import bcrypt from 'bcryptjs';
import { connectDB, sequelize } from '../config/database.js';
import { User, Wallet, Game } from '../models/index.js';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDB();
    await sequelize.sync({ alter: true });

    // 1. Seed Super Admin (admin@betluxa.com / betluxasuperadmin / PIN: 888888)
    const adminPasswordHash = await bcrypt.hash('betluxasuperadmin', 10);
    const adminPinHash = await bcrypt.hash('888888', 10);

    const [adminUser] = await User.findOrCreate({
      where: { email: 'admin@betluxa.com' },
      defaults: {
        username: 'betluxa_admin',
        email: 'admin@betluxa.com',
        password_hash: adminPasswordHash,
        security_pin_hash: adminPinHash,
        role: 'super_admin',
        status: 'active',
        currency: 'USD',
      },
    });
    console.log('✅ Super Admin verified/seeded: admin@betluxa.com');

    // 2. Seed Demo Player (demoplayer@gmail.com / demoplayer@123)
    const playerPasswordHash = await bcrypt.hash('demoplayer@123', 10);

    const [demoPlayer] = await User.findOrCreate({
      where: { email: 'demoplayer@gmail.com' },
      defaults: {
        username: 'demoplayer',
        email: 'demoplayer@gmail.com',
        phone: '+1234567890',
        password_hash: playerPasswordHash,
        role: 'player',
        status: 'active',
        currency: 'USD',
      },
    });

    // Ensure Demo Player has $1000 balance
    const [playerWallet] = await Wallet.findOrCreate({
      where: { user_id: demoPlayer.id },
      defaults: {
        user_id: demoPlayer.id,
        balance: 1000.0,
        bonus_balance: 50.0,
        locked_balance: 0.0,
        currency: 'USD',
      },
    });
    console.log(`✅ Demo Player verified/seeded: demoplayer@gmail.com (Balance: $${playerWallet.balance})`);

    // 3. Seed Default Casino Games
    const defaultGames = [
      {
        name: 'Gates of Olympus',
        provider: 'Pragmatic Play',
        category: 'slots' as const,
        game_code: 'vs20olympgate',
        thumbnail_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
        is_active: true,
      },
      {
        name: 'Sweet Bonanza',
        provider: 'Pragmatic Play',
        category: 'slots' as const,
        game_code: 'vs20fruitsw',
        thumbnail_url: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&w=600&q=80',
        is_active: true,
      },
      {
        name: 'Lightning Roulette',
        provider: 'Evolution Gaming',
        category: 'live_casino' as const,
        game_code: 'evo_lightning_roulette',
        thumbnail_url: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80',
        is_active: true,
      },
      {
        name: 'Live Blackjack VIP',
        provider: 'Evolution Gaming',
        category: 'live_casino' as const,
        game_code: 'evo_blackjack_vip',
        thumbnail_url: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80',
        is_active: true,
      },
      {
        name: 'Aviator (Crash)',
        provider: 'Spribe',
        category: 'crash' as const,
        game_code: 'spribe_aviator',
        thumbnail_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        is_active: true,
      },
      {
        name: 'Mines',
        provider: 'Spribe',
        category: 'crash' as const,
        game_code: 'spribe_mines',
        thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        is_active: true,
      },
      {
        name: 'European Roulette Pro',
        provider: 'NetEnt',
        category: 'table' as const,
        game_code: 'netent_roulette_pro',
        thumbnail_url: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=600&q=80',
        is_active: true,
      },
      {
        name: 'Classic Baccarat',
        provider: 'Pragmatic Play',
        category: 'table' as const,
        game_code: 'prag_baccarat',
        thumbnail_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
        is_active: true,
      },
    ];

    for (const g of defaultGames) {
      await Game.findOrCreate({
        where: { provider: g.provider, game_code: g.game_code },
        defaults: g,
      });
    }
    console.log(`✅ Seeded ${defaultGames.length} default casino games.`);

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();

