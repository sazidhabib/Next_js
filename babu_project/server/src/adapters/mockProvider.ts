import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Game } from '../models/Game.js';
import { WalletService } from '../services/WalletService.js';
import { v4 as uuidv4 } from 'uuid';

const SEAMLESS_SECRET_KEY = process.env.SEAMLESS_SECRET_KEY || 'seamless_secret_mock_key_2026';

export class MockProvider {
  /**
   * Generate an interactive Game Iframe session URL
   */
  public static async createGameSession(userId: string, gameId: string): Promise<string> {
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    // Generate launch session token
    const sessionToken = jwt.sign(
      {
        userId,
        gameId,
        gameCode: game.game_code,
        provider: game.provider,
      },
      SEAMLESS_SECRET_KEY,
      { expiresIn: '1h' }
    );

    const port = process.env.PORT || 5000;
    return `http://localhost:${port}/api/v1/provider/mock/launcher?token=${sessionToken}`;
  }

  /**
   * Serve responsive playable HTML game client inside iFrame
   */
  public static async renderGameClient(req: Request, res: Response): Promise<void> {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      res.status(400).send('<h3>Invalid Game Launch Session</h3>');
      return;
    }

    try {
      const decoded = jwt.verify(token, SEAMLESS_SECRET_KEY) as {
        userId: string;
        gameId: string;
        gameCode: string;
        provider: string;
      };

      const game = await Game.findByPk(decoded.gameId);
      const gameTitle = game ? game.name : 'Casino Game';

      // HTML client running inside the iFrame that talks to our Seamless Wallet
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameTitle} - BetLuxa Casino</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: radial-gradient(circle at center, #1e1b4b, #09090b); color: #fff; font-family: sans-serif; user-select: none; }
    .reel { font-size: 3rem; height: 100px; display: flex; align-items: center; justify-content: center; background: #0f172a; border-radius: 12px; border: 2px solid #334155; }
    .glow-gold { box-shadow: 0 0 25px rgba(234, 179, 8, 0.4); }
  </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen p-4">
  <div class="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 glow-gold text-center">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/40">
        ${game?.provider || 'PRAGMATIC PLAY'}
      </span>
      <div class="text-right">
        <span class="text-xs text-slate-400">Balance:</span>
        <span id="balanceDisplay" class="font-bold text-emerald-400 text-lg ml-1">Loading...</span>
      </div>
    </div>

    <h2 class="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 mb-4">
      ${gameTitle}
    </h2>

    <!-- Reels / Game Screen -->
    <div class="grid grid-cols-3 gap-3 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
      <div id="reel1" class="reel">🍒</div>
      <div id="reel2" class="reel">🍋</div>
      <div id="reel3" class="reel">💎</div>
    </div>

    <!-- Win Status -->
    <div id="statusMessage" class="min-h-[2rem] text-sm font-semibold text-slate-300 mb-4">
      Select your bet and press Spin!
    </div>

    <!-- Bet Controls -->
    <div class="flex items-center justify-between gap-3 mb-6 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
      <span class="text-xs text-slate-400 uppercase font-bold pl-2">Bet Size:</span>
      <div class="flex items-center gap-1.5">
        <button onclick="adjustBet(-1)" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold">-</button>
        <span id="betDisplay" class="font-bold text-amber-300 text-base min-w-[3rem]">$1.00</span>
        <button onclick="adjustBet(1)" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold">+</button>
      </div>
    </div>

    <!-- Action Buttons -->
    <button id="spinBtn" onclick="spin()" class="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-slate-950 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-50">
      SPIN NOW
    </button>
  </div>

  <script>
    const token = "${token}";
    let currentBet = 1.0;
    const symbols = ['🍒', '🍋', '🍇', '🔔', '7️⃣', '💎'];

    async function fetchBalance() {
      try {
        const res = await fetch('/api/v1/callback/seamless/balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (data.status === 'OK') {
          document.getElementById('balanceDisplay').innerText = '$' + Number(data.balance).toFixed(2);
        }
      } catch (e) {
        console.error(e);
      }
    }

    function adjustBet(delta) {
      currentBet = Math.max(1, currentBet + delta);
      document.getElementById('betDisplay').innerText = '$' + currentBet.toFixed(2);
    }

    async function spin() {
      const btn = document.getElementById('spinBtn');
      const status = document.getElementById('statusMessage');
      btn.disabled = true;
      status.innerText = 'Spinning...';

      // 1. Debit Bet via Seamless Wallet
      const roundId = 'RND_' + Date.now();
      const txId = 'TX_BET_' + Date.now() + '_' + Math.floor(Math.random()*1000);

      try {
        const betRes = await fetch('/api/v1/callback/seamless/bet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            roundId,
            transactionId: txId,
            amount: currentBet
          })
        });
        const betData = await betRes.json();

        if (betData.status !== 'OK') {
          status.innerHTML = '<span class="text-rose-400 font-bold">' + (betData.message || 'Bet failed') + '</span>';
          btn.disabled = false;
          return;
        }

        document.getElementById('balanceDisplay').innerText = '$' + Number(betData.balance).toFixed(2);

        // Animate reels
        let spins = 0;
        const interval = setInterval(() => {
          document.getElementById('reel1').innerText = symbols[Math.floor(Math.random() * symbols.length)];
          document.getElementById('reel2').innerText = symbols[Math.floor(Math.random() * symbols.length)];
          document.getElementById('reel3').innerText = symbols[Math.floor(Math.random() * symbols.length)];
          spins++;
          if (spins > 10) {
            clearInterval(interval);
            finishSpin(roundId);
          }
        }, 80);

      } catch (err) {
        status.innerText = 'Network error';
        btn.disabled = false;
      }
    }

    async function finishSpin(roundId) {
      const btn = document.getElementById('spinBtn');
      const status = document.getElementById('statusMessage');
      
      // Determine Win (simulated 40% hit rate)
      const isWin = Math.random() < 0.45;
      const multiplier = isWin ? (Math.random() < 0.2 ? 5 : 2) : 0;
      const winAmount = Number((currentBet * multiplier).toFixed(2));

      if (isWin) {
        const symbol = multiplier >= 5 ? '💎' : '7️⃣';
        document.getElementById('reel1').innerText = symbol;
        document.getElementById('reel2').innerText = symbol;
        document.getElementById('reel3').innerText = symbol;

        // Credit Win via Seamless Wallet
        const winTxId = 'TX_WIN_' + Date.now() + '_' + Math.floor(Math.random()*1000);
        const winRes = await fetch('/api/v1/callback/seamless/win', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            roundId,
            transactionId: winTxId,
            amount: winAmount
          })
        });
        const winData = await winRes.json();
        document.getElementById('balanceDisplay').innerText = '$' + Number(winData.balance).toFixed(2);
        status.innerHTML = '<span class="text-amber-400 font-black text-lg animate-pulse">🎉 BIG WIN! +$' + winAmount.toFixed(2) + '</span>';
      } else {
        status.innerHTML = '<span class="text-slate-400">Better luck next spin!</span>';
      }

      btn.disabled = false;
    }

    fetchBalance();
  </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (err: any) {
      res.status(403).send('<h3>Session Expired or Unauthorized</h3>');
    }
  }
}

