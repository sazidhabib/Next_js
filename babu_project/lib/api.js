const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function apiRequest(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'API Request Failed');
  }
  return data;
}

export const api = {
  // Auth
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  adminLogin: (payload) => apiRequest('/auth/admin/login', { method: 'POST', body: JSON.stringify(payload) }),

  // Player
  getProfile: () => apiRequest('/player/profile'),
  getGames: (category = 'all') => apiRequest(`/player/games?category=${category}`),
  launchGame: (gameId) => apiRequest(`/player/games/${gameId}/launch`),
  submitDeposit: (payload) => apiRequest('/player/wallet/deposit', { method: 'POST', body: JSON.stringify(payload) }),
  submitWithdrawal: (payload) => apiRequest('/player/wallet/withdraw', { method: 'POST', body: JSON.stringify(payload) }),
  getTransactions: () => apiRequest('/player/wallet/transactions'),
  getBets: () => apiRequest('/player/wallet/bets'),

  // Admin
  getAdminStats: () => apiRequest('/admin/stats'),
  getPendingDeposits: () => apiRequest('/admin/deposits/pending'),
  getPendingWithdrawals: () => apiRequest('/admin/withdrawals/pending'),
  approveDeposit: (id) => apiRequest(`/admin/deposits/${id}/approve`, { method: 'POST' }),
  rejectDeposit: (id, reason) => apiRequest(`/admin/deposits/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  approveWithdrawal: (id) => apiRequest(`/admin/withdrawals/${id}/approve`, { method: 'POST' }),
  rejectWithdrawal: (id, reason) => apiRequest(`/admin/withdrawals/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  getAdminUsers: () => apiRequest('/admin/users'),
  adjustBalance: (payload) => apiRequest('/admin/users/balance-adjust', { method: 'POST', body: JSON.stringify(payload) }),
};

