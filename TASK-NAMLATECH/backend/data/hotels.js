import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDirectory = path.dirname(fileURLToPath(import.meta.url));
const hotelsFile = path.join(dataDirectory, "hotels.json");
const seedHotels = [
  {
    id: 1,
    title: "Grand Palace Hotel",
    description: "Comfortable rooms with modern facilities.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    id: 2,
    title: "Ocean View Resort",
    description: "Beautiful beach view and relaxing atmosphere.",
    price: 6500,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    latitude: 15.2993,
    longitude: 74.124,
  },
  {
    id: 3,
    title: "Green Valley Stay",
    description: "Peaceful hotel surrounded by nature.",
    price: 2800,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
    latitude: 11.4102,
    longitude: 76.695,
  },
  {
    id: 4,
    title: "The Palm Retreat",
    description: "A quiet coastal escape with sunlit rooms and a garden pool.",
    price: 5200,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    latitude: 9.9312,
    longitude: 76.2673,
  },
  {
    id: 5,
    title: "Blue Lagoon Suites",
    description: "Relax by the water in spacious suites with beautiful sea views.",
    price: 7800,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    latitude: 15.4909,
    longitude: 73.8278,
  },
  {
    id: 6,
    title: "The Cedar House",
    description: "A welcoming mountain hideaway surrounded by pine forests.",
    price: 3900,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    latitude: 32.2432,
    longitude: 77.1892,
  },
  {
    id: 7,
    title: "Marigold Heritage Inn",
    description: "A character-filled heritage stay close to the city’s old quarter.",
    price: 6100,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    latitude: 26.9124,
    longitude: 75.7873,
  },
  {
    id: 8,
    title: "Silver Fern Lodge",
    description: "Cosy rooms, fresh mountain air, and trails right outside your door.",
    price: 3400,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    latitude: 30.3165,
    longitude: 78.0322,
  },
  {
    id: 9,
    title: "Sunset Bay Hotel",
    description: "Watch the evening sky from a relaxed beachfront property.",
    price: 7200,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    id: 10,
    title: "The Willow Boutique",
    description: "A peaceful boutique stay with thoughtful details and warm service.",
    price: 4600,
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974",
    latitude: 12.9716,
    longitude: 77.5946,
  },
];

if (!fs.existsSync(hotelsFile)) {
  fs.writeFileSync(hotelsFile, JSON.stringify(seedHotels, null, 2));
}

export const hotels = JSON.parse(fs.readFileSync(hotelsFile, "utf8"));

export function saveHotels() {
  fs.writeFileSync(hotelsFile, JSON.stringify(hotels, null, 2));
}
