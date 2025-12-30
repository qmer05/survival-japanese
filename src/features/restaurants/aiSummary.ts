import type { OverpassRestaurant } from "./overpass";

export function generateRestaurantOverview(r: OverpassRestaurant): string {
  const t = r.tags;

  const cuisine = t.cuisine ? prettify(t.cuisine) : null;
  const takeout = yesNoMaybe(t.takeaway);
  const delivery = yesNoMaybe(t.delivery);
  const vegan = yesNoMaybe(t.vegan);
  const vegetarian = yesNoMaybe(t.vegetarian);
  const wheelchair = yesNoMaybe(t.wheelchair);
  const hours = t.opening_hours ?? null;
  const phone = t.phone ?? t["contact:phone"] ?? null;
  const website = t.website ?? t["contact:website"] ?? null;

  const bullets: string[] = [];

  if (cuisine) bullets.push(`Cuisine: ${cuisine}`);
  if (hours) bullets.push(`Hours: ${hours}`);
  if (takeout) bullets.push(`Takeaway: ${takeout}`);
  if (delivery) bullets.push(`Delivery: ${delivery}`);
  if (vegan) bullets.push(`Vegan: ${vegan}`);
  if (vegetarian) bullets.push(`Vegetarian: ${vegetarian}`);
  if (wheelchair) bullets.push(`Wheelchair: ${wheelchair}`);
  if (phone) bullets.push(`Phone: ${phone}`);
  if (website) bullets.push(`Website: ${website}`);

  if (bullets.length === 0) {
    return "No extra info available yet (OSM tags are minimal for this place).";
  }

  return bullets.join(" • ");
}

function yesNoMaybe(value?: string): string | null {
  if (!value) return null;
  const v = value.toLowerCase().trim();
  if (v === "yes") return "Yes";
  if (v === "no") return "No";
  if (v === "limited") return "Limited";
  return value;
}

function prettify(cuisine: string) {
  return cuisine
    .split(";")
    .map((s) => s.trim().replaceAll("_", " "))
    .filter(Boolean)
    .join(", ");
}
