import { HelmetOptions } from 'helmet';

export const helmetConfig: HelmetOptions = {
  // 🔒 Remove "X-Powered-By: Express" header
  hidePoweredBy: true,

  // 🔒 Prevent clickjacking attacks
  frameguard: { action: 'deny' },

  // 🔒 Prevent MIME sniffing
  noSniff: true,

  // 🔒 Enable basic XSS protection
  xssFilter: true,

  // 🔒 Set Referrer Policy (don't leak full URL externally)
  referrerPolicy: { policy: 'no-referrer' },

  // 🔒 HSTS (enable only if API uses HTTPS)
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
};
