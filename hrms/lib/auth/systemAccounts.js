export const SUPER_ADMIN_CREDENTIALS = {
  username: 'superadmin',
  email: 'superadmin@hrms.com',
  password: 'suparadmin@123',
};

export const SUPER_ADMIN_USER_OBJECT = {
  id: 'system-superadmin',
  username: 'superadmin',
  name: 'Super Administrator',
  email: 'superadmin@hrms.com',
  roleId: 0,
  roleName: 'Super Admin',
  role: {
    id: 0,
    name: 'Super Admin',
    description: 'Master root account with unrestricted system access',
    permissions: ['ALL'],
  },
  permissions: ['ALL'],
  isActive: true,
  isSystemSuperAdmin: true,
  employeeId: null,
  employee: null,
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  email: 'admin@hrms.com',
  defaultPassword: 'admin123',
  name: 'System Administrator',
};

export function isSuperAdminIdentifier(identifier) {
  if (!identifier) return false;
  const clean = String(identifier).trim().toLowerCase();
  return (
    clean === SUPER_ADMIN_CREDENTIALS.username.toLowerCase() ||
    clean === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()
  );
}

export function verifySuperAdminPassword(password) {
  return password === SUPER_ADMIN_CREDENTIALS.password;
}

export function parseSessionToken(token) {
  if (!token) return null;
  try {
    const decodedString = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decodedString);
  } catch (e) {
    return null;
  }
}

export async function ensureDefaultAdminExists(User, Role, bcrypt) {
  try {
    const { Op } = await import('sequelize');
    const existing = await User.findOne({
      where: {
        [Op.or]: [
          { username: DEFAULT_ADMIN_CREDENTIALS.username },
          { email: DEFAULT_ADMIN_CREDENTIALS.email },
        ],
      },
    });

    if (existing) return existing;

    let adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      adminRole = await Role.create({
        name: 'Admin',
        description: 'Full system operations control',
        permissions: ['ALL'],
      });
    }

    const defaultHash = await bcrypt.hash(DEFAULT_ADMIN_CREDENTIALS.defaultPassword, 10);
    const newAdmin = await User.create({
      username: DEFAULT_ADMIN_CREDENTIALS.username,
      email: DEFAULT_ADMIN_CREDENTIALS.email,
      name: DEFAULT_ADMIN_CREDENTIALS.name,
      passwordHash: defaultHash,
      roleId: adminRole.id,
      isActive: true,
    });

    return newAdmin;
  } catch (err) {
    console.warn('ensureDefaultAdminExists warning:', err.message);
    return null;
  }
}
