import Cookie from "universal-cookie";
export function setCookie(cookieName, cookieValue) {
    const cookies = new Cookie();
    cookies.set(cookieName, cookieValue);
  }
  
  export function getCookie(cookieName) {
    const cookies = new Cookie();
    return cookies.get(cookieName);
  }
  
  export function removeCookie(cookieName) {
    const cookies = new Cookie();
    cookies.remove(cookieName);
  }