export const SUBMIT_LOGIN = 'SUBMIT_LOGIN';
export const SUBMIT_LOGOUT = 'SUBMIT_LOGOUT';

export function submitLogin() {
  return {
    type: SUBMIT_LOGIN
  }
}

export function submitLogout() {
  return {
    type: SUBMIT_LOGOUT
  }
}
