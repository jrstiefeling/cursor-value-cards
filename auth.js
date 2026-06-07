// auth.js
// Authentication utility — enterprise SSO variant of the Value Intelligence Platform
//
// Context: The public GitHub Pages deployment (jrstiefeling.github.io/cursor-value-cards)
// requires no authentication. This module is included to support an enterprise-hosted
// variant where organizations require SSO before accessing ROI data and company
// research outputs for named accounts.
//
// This file is intentionally NOT imported by index.html in the public deployment.

import jwt from 'jsonwebtoken';

/**
 * Verifies a JWT token against the application secret.
 * @param {string} token - Raw JWT from Authorization header or session cookie
 * @returns {object} decoded - The decoded token payload
 */
export function verifyToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

/**
 * Extracts user identity and role from a verified token.
 * @param {string} token - Raw JWT token
 * @returns {{ id: string, role: string, org: string }} user identity
 */
export function getUserFromToken(token) {
  const decoded = verifyToken(token);
  return { id: decoded.userId, role: decoded.role, org: decoded.org };
}

/**
 * Determines whether a user role has access to a given industry vertical's data.
 * Admin sees all. SE role sees all except defense. Demo role sees tech and retail only.
 * @param {string} role - User role from token (admin | se | demo)
 * @param {string} vertical - Industry vertical id (fintech | tech | defense | health | retail)
 * @returns {boolean}
 */
export function hasVerticalAccess(role, vertical) {
  const accessMap = {
    admin: ['fintech', 'tech', 'defense', 'health', 'retail'],
    se:    ['fintech', 'tech', 'health', 'retail'],
    demo:  ['tech', 'retail'],
  };
  return accessMap[role]?.includes(vertical) ?? false;
}
