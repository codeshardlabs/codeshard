import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function protectedRouteHeaders(userId, hasJsonBody= false) {
  let headers = {
    "Authorization": `Bearer ${userId}`
  }

  if(hasJsonBody) {
    headers["Content-Type"] = "application/json"
  }

  return headers;
}

export function jsonify(content) {
  return JSON.stringify(content);
}