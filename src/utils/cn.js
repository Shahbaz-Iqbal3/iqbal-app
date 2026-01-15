// src/lib/utils.js

// simple classNames merge utility (no clsx, no new installs)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
