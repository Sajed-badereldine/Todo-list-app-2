const TOKEN_KEY = 'todo_app_token';
const PENDING_VERIFICATION_EMAIL_KEY = 'todo_app_pending_verification_email';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getPendingVerificationEmail() {
  return sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) || localStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY);
}

export function setPendingVerificationEmail(email) {
  sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email);
  localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email);
}

export function clearPendingVerificationEmail() {
  sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
  localStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
}
