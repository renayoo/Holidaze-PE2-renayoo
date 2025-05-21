import { API_KEY } from "./constants";

export function headers(body = false) {
  const h = new Headers();

  h.append("X-Noroff-API-Key", API_KEY);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.data?.accessToken || localStorage.getItem("accessToken");

  if (token) {
    h.append("Authorization", `Bearer ${token}`);
  }

  if (body) {
    h.append("Content-Type", "application/json");
  }

  return h;
}
