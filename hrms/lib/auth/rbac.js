import { NextResponse } from 'next/server';
import { initDb, User, Role } from '@/lib/db/models/index';
import { parseSessionToken, SUPER_ADMIN_USER_OBJECT } from '@/lib/auth/systemAccounts';
import { expandPermissions, getPermissionCode } from '@/lib/auth/permissions';

/**
 * Extracts and verifies the authenticated session from an incoming Next.js Request.
 */
export async function getAuthSession(request) {
  try {
    const tokenFromCookie = request.cookies.get('hrms_session_token')?.value;
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) return null;

    const decoded = parseSessionToken(token);
    if (!decoded?.uid) return null;

    if (decoded.uid === 'system-superadmin' || decoded.role === 'Super Admin') {
      return {
        ...SUPER_ADMIN_USER_OBJECT,
        permissions: ['ALL'],
        isSuperAdmin: true,
      };
    }

    await initDb();
    const user = await User.findByPk(decoded.uid, {
      include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
    });

    if (!user || !user.isActive) return null;

    const rawPerms = user.role?.permissions || [];
    const permissions = expandPermissions(
      Array.isArray(rawPerms)
        ? rawPerms
        : typeof rawPerms === 'string'
        ? (() => {
            try {
              return JSON.parse(rawPerms);
            } catch {
              return rawPerms.split(',');
            }
          })()
        : []
    );

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role?.name || 'Employee',
      permissions,
      employeeId: user.employeeId,
    };
  } catch (error) {
    console.error('getAuthSession error:', error);
    return null;
  }
}

/**
 * Checks if a session has permission for an action/code
 */
export function hasSessionPermission(session, permSpec) {
  if (!session) return false;

  const role = session.roleName;
  if (role === 'Super Admin' || role === 'Admin' || role === 'Restaurant Owner') return true;

  const perms = session.permissions || [];
  if (perms.includes('ALL')) return true;

  if (typeof permSpec === 'function') {
    return permSpec(session);
  }

  if (Array.isArray(permSpec)) {
    return permSpec.some((spec) => hasSessionPermission(session, spec));
  }

  if (typeof permSpec === 'string') {
    return perms.includes(permSpec);
  }

  if (permSpec && typeof permSpec === 'object' && permSpec.section && permSpec.action) {
    const code = getPermissionCode(permSpec.section, permSpec.action);
    if (code && perms.includes(code)) return true;

    // View fallback
    if (permSpec.action.toUpperCase() === 'VIEW') {
      const editCode = getPermissionCode(permSpec.section, 'EDIT');
      const deleteCode = getPermissionCode(permSpec.section, 'DELETE');
      if (editCode && perms.includes(editCode)) return true;
      if (deleteCode && perms.includes(deleteCode)) return true;
    }
  }

  return false;
}

/**
 * Guard utility for API route handlers.
 * Usage:
 *   const auth = await requirePermission(request, { section: 'departments', action: 'EDIT' });
 *   if (!auth.authorized) return auth.response;
 */
export async function requirePermission(request, permSpec) {
  const session = await getAuthSession(request);
  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized: Valid session required' },
        { status: 401 }
      ),
      session: null,
    };
  }

  if (!hasSessionPermission(session, permSpec)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: `Forbidden: You do not have permission to perform this action (${
            typeof permSpec === 'string'
              ? permSpec
              : `${permSpec.section}:${permSpec.action}`
          })`,
        },
        { status: 403 }
      ),
      session,
    };
  }

  return {
    authorized: true,
    session,
  };
}
