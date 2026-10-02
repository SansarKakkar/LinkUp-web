export const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : (import.meta.env.VITE_BASE_URL || "/api");
