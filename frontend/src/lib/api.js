const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Map Backend -> Frontend
const mapToFrontend = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  // Map brand -> company
  company: p.brand || "Unknown",
  category: p.category,
  // Map image_url -> image (fallback if empty)
  image: p.image_url || "https://placehold.co/400",
  // Ensure array for ratings
  userRatings: p.userRatings || [],
  isNew: p.isNew || false,
  isSale: p.isSale || false,
  gender: p.gender || "unisex",
  color: p.color
});

export const api = {
  async search(query) {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return data.map(mapToFrontend);
  },

  async getAll() {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    return data.map(mapToFrontend);
  },

  async create(product) {
    // Map Frontend Form -> Backend
    const payload = {
      name: product.name,
      description: product.description,
      brand: product.company, // Frontend uses company
      category: product.category,
      price: parseFloat(product.price),
      image_url: product.image, // Frontend form should allow entering this
      gender: product.gender,
      color: product.color
    };

    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Create failed");
    const data = await res.json();
    return mapToFrontend(data);
  }
};
