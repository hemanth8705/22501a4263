// Define the allowed types
type Stack = "frontend" | "backend";
type Level = "debug" | "info" | "error" | "fatal";
type Package =
  | "apps"
  | "component"
  | "hack"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils"; // frontend + shared ones

interface LogParams {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

/**
 * Sends a structured log to the remote logging server.
 */
export async function log({ stack, level, package: pkg, message }: LogParams): Promise<void> {
  try {
    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    if (!res.ok) {
      console.warn("❌ Logging failed:", res.status);
    } else {
      const json = await res.json();
      console.debug("✅ Log sent:", json.logID);
    }
  } catch (error) {
    console.error("Logging error:", error);
  }
}
