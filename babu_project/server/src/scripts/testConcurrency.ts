import { connectDB, sequelize } from '../config/database.js';
import { User, Wallet, BetRound } from '../models/index.js';
import { WalletService } from '../services/WalletService.js';
import bcrypt from 'bcryptjs';

async function runConcurrencyTest() {
  try {
    console.log('🧪 Starting Concurrency & Financial Integrity Test...');
    await connectDB();
    await sequelize.sync();

    // 1. Setup isolated test user with $10 balance
    const email = `test_concurrency_${Date.now()}@test.com`;
    const passwordHash = await bcrypt.hash('pass123', 10);
    const user = await User.create({
      username: `user_${Date.now()}`,
      email,
      password_hash: passwordHash,
      role: 'player',
      status: 'active',
      currency: 'USD',
    });

    const wallet = await Wallet.create({
      user_id: user.id,
      balance: 10.0,
      bonus_balance: 0.0,
      locked_balance: 0.0,
      currency: 'USD',
    });

    console.log(`👤 Created Test Player: ${user.username} with Initial Balance: $${wallet.balance}`);

    // 2. Fire 20 SIMULTANEOUS bet debit requests of $1.00 each
    console.log('⚡ Firing 20 simultaneous bet requests ($1.00 each) on $10.00 balance...');
    const betPromises = [];
    for (let i = 1; i <= 20; i++) {
      betPromises.push(
        WalletService.executeBet({
          userId: user.id,
          amount: 1.0,
          providerRoundId: `RND_${Date.now()}_${i}`,
          providerTxId: `TX_${Date.now()}_${i}`,
        })
          .then((res) => ({ index: i, success: true, balance: res.balance }))
          .catch((err) => ({ index: i, success: false, error: err.message }))
      );
    }

    const results = await Promise.all(betPromises);

    const successfulBets = results.filter((r) => r.success);
    const failedBets = results.filter((r) => !r.success);

    console.log(`📊 Successful Bets: ${successfulBets.length} (Expected: 10)`);
    console.log(`📊 Rejected Bets (Insufficient Funds): ${failedBets.length} (Expected: 10)`);

    // 3. Verify final balance in MySQL
    const updatedWallet = await Wallet.findOne({ where: { user_id: user.id } });
    console.log(`💰 Final Player Balance in MySQL: $${updatedWallet?.balance} (Expected: $0.00)`);

    if (successfulBets.length === 10 && failedBets.length === 10 && updatedWallet?.balance === 0) {
      console.log('✅ TEST PASSED: Zero double-spending detected. Row locking is 100% ACID-compliant!');
    } else {
      console.error('❌ TEST FAILED: Race condition or balance discrepancy detected!');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

runConcurrencyTest();

