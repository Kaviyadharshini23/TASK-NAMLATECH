import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import multer from "multer";
import {
  createHotel,
  deleteHotel,
  getHotel,
  listHotels,
  updateHotel,
} from "../controllers/hotelController.js";

const router = express.Router();
const backendDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const uploadDirectory = path.join(backendDirectory, "uploads");
const extensionsByMime = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadDirectory),
  filename: (_request, file, callback) => {
    callback(null, `${randomUUID()}${extensionsByMime[file.mimetype] || ".img"}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!extensionsByMime[file.mimetype]) {
      callback(new Error("Upload a JPG, PNG, WebP, GIF, or AVIF image."));
      return;
    }
    callback(null, true);
  },
});

router.get("/", listHotels);
router.get("/:id", getHotel);
router.post("/", upload.single("imageFile"), createHotel);
router.put("/:id", upload.single("imageFile"), updateHotel);
router.delete("/:id", deleteHotel);

export default router;
