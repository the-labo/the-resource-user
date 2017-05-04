/**
 * Constant variables
 */
'use strict'

module.exports = Object.freeze({
  USERNAME_PATTERN: /^[a-zA-Z0-9_-]+$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_PATTERN: /^[a-zA-Z0-9_\-!?=$+&]+$/,
  DEFAULT_PASSWORD_ALGORITHM: 'sha1',
  DEFAULT_SESSION_LIFETIME: 3 * 24 * 60 * 60 * 1000
})
