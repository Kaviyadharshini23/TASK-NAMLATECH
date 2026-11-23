import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import hotelRoutes from "./routes/hotelRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.join(serverDirectory, "uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadDirectory));
app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", storage: "in-memory" });
});
app.use("/api/hotels", hotelRoutes);
app.use((request, response) => {
  response.status(404).json({ error: `Route not found: ${request.method} ${request.path}` });
});
app.use(errorHandler);

app.listen(port, "127.0.0.1", () => {
  console.log(`HotelHub demo API listening at http://127.0.0.1:${port}`);
});
