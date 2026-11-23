async function request(path, options = {}) {
  const response = await fetch(path, options);
  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

function toHotelFormData(hotel, imageFile) {
  const formData = new FormData();
  for (const field of ["title", "description", "price", "latitude", "longitude"]) {
    formData.append(field, String(hotel[field]));
  }
  if (imageFile) formData.append("imageFile", imageFile);
  return formData;
}

export const hotelService = {
  list: ({ title = "", minPrice = "", maxPrice = "", offset = 0, limit = 100 } = {}) => {
    const query = new URLSearchParams({ title, offset: String(offset), limit: String(limit) });
    if (minPrice !== "") query.set("minPrice", String(minPrice));
    if (maxPrice !== "") query.set("maxPrice", String(maxPrice));
    return request(`/api/hotels?${query.toString()}`);
  },
  get: (id) => request(`/api/hotels/${id}`),
  create: ({ hotel, imageFile }) => request("/api/hotels", {
    method: "POST",
    body: toHotelFormData(hotel, imageFile),
  }),
  update: ({ hotel, imageFile }) => request(`/api/hotels/${hotel.id}`, {
    method: "PUT",
    body: toHotelFormData(hotel, imageFile),
  }),
  remove: (id) => request(`/api/hotels/${id}`, { method: "DELETE" }),
};
