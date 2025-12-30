export type OverpassRestaurant = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tags: Record<string, string>;
};

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

export async function fetchNearbyRestaurants(params: {
  lat: number;
  lon: number;
  radiusMeters: number;
  limit: number;
}): Promise<OverpassRestaurant[]> {
  const { lat, lon, radiusMeters, limit } = params;

  // We ask for nodes + ways + relations tagged as restaurants
  // "out center" gives a center point for ways/relations.
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lon});
      way["amenity"="restaurant"](around:${radiusMeters},${lat},${lon});
      relation["amenity"="restaurant"](around:${radiusMeters},${lat},${lon});
    );
    out tags center ${limit};
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: query.trim(),
  });

  const json = (await res.json()) as { elements: OverpassElement[] };

  const restaurants = (json.elements ?? [])
    .map((el) => {
      const tags = el.tags ?? {};
      const name = tags.name ?? "(No name)";
      const pos = el.type === "node"
        ? { lat: el.lat!, lon: el.lon! }
        : { lat: el.center!.lat, lon: el.center!.lon };

      return {
        id: `${el.type}/${el.id}`,
        name,
        lat: pos.lat,
        lon: pos.lon,
        tags,
      } as OverpassRestaurant;
    })
    .slice(0, limit);

  return restaurants;
}
