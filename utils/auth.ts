// utils/auth.ts
import { jwtDecode } from "jwt-decode";

export function getLoggedInUserName(): string {
  const token = localStorage.getItem("token");
  if (!token) return "";

  try {
    const decoded: any = jwtDecode(token);
    return decoded.usr_name || ""; // or decoded.usr_id if you only store ID
  } catch (error) {
    console.error("Invalid token:", error);
    return "";
  }
}
