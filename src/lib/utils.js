import { clsx } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function protectedRouteHeaders(userId, hasJsonBody=false) {
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

export function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function throwFailureCb(out,metadata) {
  let errorMessage = metadata.src + " response does not contain valid output: " + out;
  if(userDetails.error) errorMessage = userDetails.error.message;
  throw new Error(errorMessage);
}

export function logFailureCb(out, metadata) {
  if (out?.error) console.log("error message: ", out?.error?.message)
      console.log("unexpected error happened while invoking" + `${metadata.src}: ` + out);
  redirect(metadata.redirectUri)
}

export function handleFailureCase(out, successDataFields, metadata, failureCb) {
  if (!out || typeof out !== "object" || out.error || !out.data || !successDataFields.every((field) => field in out.data)) {
      failureCb(out, metadata);
    }
}

export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
