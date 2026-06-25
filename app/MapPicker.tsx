"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoJSONSource, Map as MbMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Area } from "@/lib/areas";
import { Housing } from "@/lib/calc";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE || "mapbox://styles/mapbox/light-v11";

function pinLabel(area: Area, housing: Housing) {
  const value = housing === "buy" ? area.medianHouse : area.weeklyRent2br;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: area.currency,
    notation: "compact",
    maximumFractionDigits: housing === "buy" ? 1 : 0,
  }).format(value);
}

function buildFC(areas: Area[], housing: Housing) {
  return {
    type: "FeatureCollection" as const,
    features: areas.map((a) => ({
      type: "Feature" as const,
      id: a.id,
      properties: { pid: a.id, price: pinLabel(a, housing) },
      geometry: { type: "Point" as const, coordinates: [a.lng, a.lat] },
    })),
  };
}

const SELECTED = ["boolean", ["feature-state", "selected"], false] as const;

export default function MapPicker({
  areas,
  selectedId,
  onSelect,
  housing,
}: {
  areas: Area[];
  selectedId: string;
  onSelect: (id: string) => void;
  housing: Housing;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MbMap | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const prevSelRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  // Init once. All pins are native map layers, so they're drawn on the GPU in
  // sync with the map — no lag, always glued, automatic label decluttering.
  useEffect(() => {
    if (!TOKEN || !containerRef.current) return;
    let map: MbMap | null = null;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !containerRef.current) return;
      mapboxgl.accessToken = TOKEN;
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: STYLE,
        center: [134, -28],
        zoom: 3,
        attributionControl: false,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;

      map.on("load", () => {
        if (cancelled || !map) return;
        map.addSource("areas", {
          type: "geojson",
          data: buildFC([], housing),
          cluster: true,
          clusterRadius: 52,
          clusterMaxZoom: 12,
          promoteId: "pid",
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "areas",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#3b2a40",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
            "circle-radius": ["step", ["get", "point_count"], 15, 5, 19, 15, 24],
          },
        });
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "areas",
          filter: ["has", "point_count"],
          layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
          paint: { "text-color": "#ffffff" },
        });

        map.addLayer({
          id: "point-dots",
          type: "circle",
          source: "areas",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": ["case", SELECTED, "#b25c72", "#ffffff"],
            "circle-stroke-color": "#b25c72",
            "circle-stroke-width": 2,
            "circle-radius": ["case", SELECTED, 8, 5],
          },
        });
        map.addLayer({
          id: "point-labels",
          type: "symbol",
          source: "areas",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "text-field": ["get", "price"],
            "text-size": 12,
            "text-offset": [0, 1.1],
            "text-anchor": "top",
            "text-allow-overlap": false,
            "text-optional": true,
          },
          paint: {
            "text-color": ["case", SELECTED, "#8a3f54", "#3f3f46"],
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.6,
          },
        });

        map.on("click", "clusters", (e) => {
          const feat = e.features?.[0] as unknown as
            | { properties: { cluster_id: number }; geometry: { coordinates: [number, number] } }
            | undefined;
          if (!feat) return;
          const src = map!.getSource("areas") as GeoJSONSource;
          src.getClusterExpansionZoom(feat.properties.cluster_id, (err, zoom) => {
            if (!err && zoom != null) map!.easeTo({ center: feat.geometry.coordinates, zoom });
          });
        });
        map.on("click", "point-dots", (e) => {
          const feat = e.features?.[0] as unknown as { properties: { pid: string } } | undefined;
          if (feat?.properties?.pid) onSelectRef.current(String(feat.properties.pid));
        });
        for (const layer of ["clusters", "point-dots", "point-labels"]) {
          map.on("mouseenter", layer, () => (map!.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", layer, () => (map!.getCanvas().style.cursor = ""));
        }

        setReady(true);
      });
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update data + refit when the area set or rent/buy changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const src = map.getSource("areas") as GeoJSONSource | undefined;
    src?.setData(buildFC(areas, housing));

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      const bounds = new mapboxgl.LngLatBounds();
      areas.forEach((a) => bounds.extend([a.lng, a.lat]));
      if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 56, maxZoom: 12, duration: 600 });
    });
  }, [areas, housing, ready]);

  // Reflect the selected area via feature-state (no re-render of pins).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (prevSelRef.current && prevSelRef.current !== selectedId) {
      map.setFeatureState({ source: "areas", id: prevSelRef.current }, { selected: false });
    }
    if (selectedId) map.setFeatureState({ source: "areas", id: selectedId }, { selected: true });
    prevSelRef.current = selectedId;
  }, [selectedId, ready]);

  if (!TOKEN) {
    return (
      <div className="mb-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
        🗺️ Add <code className="rounded bg-zinc-200 px-1">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{" "}
        <code className="rounded bg-zinc-200 px-1">.env.local</code> to pick your area on a map.
        Using the list below for now.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mb-4 h-72 w-full overflow-hidden rounded-2xl border border-zinc-200"
    />
  );
}
