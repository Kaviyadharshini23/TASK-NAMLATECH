import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hotels, saveHotels } from "../data/hotels.js";

const backendDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const uploadDirectory = path.join(backendDirectory, "uploads");

function parsePositiveInteger(value, fallback) {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseOffset(value) {
  if (value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

function validateHotel(body) {
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const price = Number(body.price);
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);

  if (!title || !description) return { error: "Hotel name and description are required." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Price must be a positive number." };
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return { error: "Latitude must be between -90 and 90." };
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return { error: "Longitude must be between -180 and 180." };
  }
  return { title, description, price, latitude, longitude };
}

function removeUploadedFile(file) {
  if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
}

function removeStoredImage(imageUrl) {
  if (!imageUrl?.startsWith("/uploads/")) return;
  const imagePath = path.join(uploadDirectory, path.basename(imageUrl));
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
}

function parseHotelId(value) {
  return parsePositiveInteger(value, null);
}

export function listHotels(request, response) {
  const { title = "", search = "" } = request.query;
  const minimum = request.query.minPrice ?? request.query.min;
  const maximum = request.query.maxPrice ?? request.query.max;
  const limit = parsePositiveInteger(request.query.limit, 100);
  const offset = parseOffset(request.query.offset);

  if (!limit || limit > 100 || offset === null) {
    return response.status(400).json({ error: "Use a limit from 1 to 100 and a non-negative offset." });
  }

  const titleFilter = String(title || search).trim().toLocaleLowerCase();
  let matches = hotels.filter((hotel) => !titleFilter || hotel.title.toLocaleLowerCase().includes(titleFilter));

  if (minimum !== undefined && minimum !== "") {
    const value = Number(minimum);
    if (!Number.isFinite(value) || value < 0) {
      return response.status(400).json({ error: "Minimum price must be zero or more." });
    }
    matches = matches.filter((hotel) => hotel.price >= value);
  }
  if (maximum !== undefined && maximum !== "") {
    const value = Number(maximum);
    if (!Number.isFinite(value) || value < 0) {
      return response.status(400).json({ error: "Maximum price must be zero or more." });
    }
    matches = matches.filter((hotel) => hotel.price <= value);
  }

  matches.sort((first, second) => {
    const firstSeed = first.id >= 1 && first.id <= 10;
    const secondSeed = second.id >= 1 && second.id <= 10;
    if (firstSeed !== secondSeed) return firstSeed ? -1 : 1;
    return firstSeed ? first.id - second.id : second.id - first.id;
  });

  response.json({
    items: matches.slice(offset, offset + limit),
    total: matches.length,
    limit,
    offset,
  });
}

export function getHotel(request, response) {
  const id = parseHotelId(request.params.id);
  if (!id) return response.status(400).json({ error: "Invalid hotel ID." });

  const hotel = hotels.find((item) => item.id === id);
  if (!hotel) return response.status(404).json({ error: "Hotel not found." });
  response.json(hotel);
}

export function createHotel(request, response) {
  const hotel = validateHotel(request.body);
  if (hotel.error) {
    removeUploadedFile(request.file);
    return response.status(400).json({ error: hotel.error });
  }
  if (!request.file) return response.status(400).json({ error: "A hotel image is required." });

  const createdHotel = {
    id: Math.max(0, ...hotels.map((item) => item.id)) + 1,
    ...hotel,
    image: `/uploads/${request.file.filename}`,
  };
  hotels.push(createdHotel);
  try {
    saveHotels();
  } catch (error) {
    hotels.pop();
    removeUploadedFile(request.file);
    throw error;
  }
  response.status(201).json(createdHotel);
}

export function updateHotel(request, response) {
  const id = parseHotelId(request.params.id);
  if (!id) {
    removeUploadedFile(request.file);
    return response.status(400).json({ error: "Invalid hotel ID." });
  }

  const hotel = validateHotel(request.body);
  if (hotel.error) {
    removeUploadedFile(request.file);
    return response.status(400).json({ error: hotel.error });
  }

  const existingHotel = hotels.find((item) => item.id === id);
  if (!existingHotel) {
    removeUploadedFile(request.file);
    return response.status(404).json({ error: "Hotel not found." });
  }

  const previousHotel = { ...existingHotel };
  Object.assign(existingHotel, hotel);
  if (request.file) {
    existingHotel.image = `/uploads/${request.file.filename}`;
  }
  try {
    saveHotels();
  } catch (error) {
    Object.assign(existingHotel, previousHotel);
    removeUploadedFile(request.file);
    throw error;
  }
  if (request.file) removeStoredImage(previousHotel.image);
  response.json(existingHotel);
}

export function deleteHotel(request, response) {
  const id = parseHotelId(request.params.id);
  if (!id) return response.status(400).json({ error: "Invalid hotel ID." });

  const index = hotels.findIndex((item) => item.id === id);
  if (index === -1) return response.status(404).json({ error: "Hotel not found." });

  const [deletedHotel] = hotels.splice(index, 1);
  try {
    saveHotels();
  } catch (error) {
    hotels.splice(index, 0, deletedHotel);
    throw error;
  }
  removeStoredImage(deletedHotel.image);
  response.status(204).end();
}
