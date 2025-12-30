import { useMemo, useState } from "react";
import { fetchNearbyRestaurants } from "./overpass";
import type { OverpassRestaurant } from "./overpass";
import { generateRestaurantOverview } from "./aiSummary";
import "./restaurants.css";

type Status =
    | { type: "idle" }
    | { type: "loading" }
    | { type: "error"; message: string }
    | { type: "ready" };

export function RestaurantsPage() {
    const [status, setStatus] = useState<Status>({ type: "idle" });
    const [restaurants, setRestaurants] = useState<OverpassRestaurant[]>([]);
    const [radiusMeters, setRadiusMeters] = useState(1200);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selected = useMemo(
        () => restaurants.find((r) => r.id === selectedId) ?? null,
        [restaurants, selectedId]
    );

    async function findNearby() {
        setStatus({ type: "loading" });

        const pos = await getCurrentPosition();
        const list = await fetchNearbyRestaurants({
            lat: pos.lat,
            lon: pos.lon,
            radiusMeters,
            limit: 25,
        });

        setRestaurants(list);
        setSelectedId(list[0]?.id ?? null);
        setStatus({ type: "ready" });
    }

    return (
        <div className="restaurants">
            <div className="container">
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 850 }}>Nearby restaurants</h2>
                <p className="sub" style={{ marginTop: 6 }}>
                    Uses OpenStreetMap (Overpass). “AI overview” is generated from available tags.
                </p>

                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 13, opacity: 0.75 }}>Radius</span>
                        <select
                            value={radiusMeters}
                            onChange={(e) => setRadiusMeters(Number(e.target.value))}
                            className="chip"
                            style={{ padding: "9px 12px" }}
                        >
                            <option value={600}>600m</option>
                            <option value={1200}>1.2km</option>
                            <option value={2000}>2km</option>
                            <option value={4000}>4km</option>
                        </select>
                    </label>

                    <button className="btn primary" onClick={findNearby} style={{ maxWidth: 320 }}>
                        📍 Find near me
                    </button>
                </div>

                {status.type === "loading" && (
                    <div style={{ marginTop: 16, opacity: 0.75 }}>Searching…</div>
                )}

                {status.type === "error" && (
                    <div style={{ marginTop: 16, color: "crimson" }}>{status.message}</div>
                )}

                {restaurants.length > 0 && (
                    <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                        <div className="card" style={{ gap: 10 }}>
                            <div style={{ fontWeight: 850, fontSize: 16 }}>
                                {selected?.name ?? "Select a restaurant"}
                            </div>
                            {selected && (
                                <div className="romaji" style={{ fontSize: 13 }}>
                                    {generateRestaurantOverview(selected)}
                                </div>
                            )}

                            {selected && (
                                <div className="actions">
                                    <button
                                        className="btn ghost"
                                        onClick={() => openGoogleMaps(selected.lat, selected.lon, selected.name)}
                                    >
                                        Open in Maps
                                    </button>
                                    <button
                                        className="btn ghost"
                                        onClick={() =>
                                            navigator.clipboard.writeText(`${selected.name} (${selected.lat}, ${selected.lon})`)
                                        }
                                    >
                                        Copy info
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="list">
                            {restaurants.map((r) => (
                                <button
                                    key={r.id}
                                    className="card"
                                    onClick={() => setSelectedId(r.id)}
                                    style={{
                                        textAlign: "left",
                                        cursor: "pointer",
                                        border:
                                            r.id === selectedId
                                                ? "1px solid rgba(139,92,246,0.35)"
                                                : undefined,
                                    }}
                                >
                                    <div style={{ fontWeight: 800 }}>{r.name}</div>
                                    <div className="romaji" style={{ marginTop: 6 }}>
                                        {generateRestaurantOverview(r)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getCurrentPosition(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
            (e) => reject(new Error(e.message)),
            { enableHighAccuracy: true, timeout: 15000 }
        );
    });
}

function openGoogleMaps(lat: number, lon: number, name: string) {
    const q = encodeURIComponent(name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${q}`, "_blank");
}