export function checkAuthHeader(request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'sazidadmin123';
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return false;
  }
  return true;
}
