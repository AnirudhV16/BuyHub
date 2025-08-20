import { jwtDecode } from "jwt-decode";

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  // Common places roles may appear; adapt to your JWT structure
  return decoded.role || decoded.roles?.[0] || decoded.authorities?.[0] || null;
}

export function getUserIdFromToken(token) {
  const decoded = decodeToken(token);
  return decoded?.id || decoded?.userId || decoded?.sub || null;
}
