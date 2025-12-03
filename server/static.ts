import express from "express";
import path from "path";
import { Express } from "express";

export function serveStatic(app: Express) {
  const distPath = path.join(process.cwd(), "dist", "public");

  // Serve static frontend files
  app.use(express.static(distPath));

  // Catch-all for client-side React Router
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
