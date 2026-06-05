import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const port = process.env.PORT || "3000";
const nextBin = require.resolve("next/dist/bin/next");

if (process.env.NODE_ENV === "production") {
  const missing = ["DATABASE_URL", "AUTH_SECRET"].filter((name) => !process.env[name]);

  if (missing.length > 0) {
    console.error(`Missing required production environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (process.env.AUTH_SECRET.length < 32) {
    console.error("AUTH_SECRET must be at least 32 characters in production.");
    process.exit(1);
  }
}

const server = spawn(process.execPath, [nextBin, "start", "-p", port], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: port,
  },
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
