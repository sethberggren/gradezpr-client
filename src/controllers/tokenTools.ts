import { NewToken } from "@backend/http/routes/authentication/generateToken";

export function getTokenFromStorage() {
  const tokenString = localStorage.getItem("token");

  if (tokenString && tokenString !== "") {
    return JSON.parse(tokenString) as NewToken;
  } else {
    return null;
  }
};

export function setTokenInStorage(token: NewToken | null) {

  const tokenString = JSON.stringify(token);

  localStorage.setItem("token", tokenString);
}