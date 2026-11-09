import type { StyleSpecification } from "maplibre-gl"

export type Site = {
  id: string
  name: string
  subtitle: string
  coordinates: [number, number]
  description: string
  category: string
  height?: number
}

export const sites: Site[] = [
  {
    id: "city-hall",
    name: "臺北市政府",
    subtitle: "TAIPEI CITY HALL",
    coordinates: [121.56372, 25.03753],
    category: "CIVIC",
    description:
      "信義區的行政與公共活動中心，西側為市民廣場。切換投影高度，觀察 HTML 面板如何與城市建築互相遮擋。",
  },
  {
    id: "taipei-101",
    name: "臺北 101",
    subtitle: "TAIPEI 101",
    coordinates: [121.5645, 25.03397],
    category: "LANDMARK",
    height: 508,
    description:
      "臺北信義區地標摩天大樓。地圖中的建築輪廓與高度取自開放圖磚，未提供高度的建築採示意高度。",
  },
  {
    id: "sun-yat-sen",
    name: "國父紀念館",
    subtitle: "SUN YAT-SEN MEMORIAL HALL",
    coordinates: [121.5603, 25.04],
    category: "CULTURE",
    description:
      "中山公園中的文化地標。從低空與俯視角度觀察公園和街廓，將 HTML 資訊直接放回其地理位置。",
  },
  {
    id: "songshan",
    name: "松山文創園區",
    subtitle: "SONGSHAN CULTURAL PARK",
    coordinates: [121.5607, 25.0437],
    category: "CULTURE",
    description:
      "由歷史工業建築轉型的文化園區。點選其他街廓也能檢視圖磚中可取得的地物資料。",
  },
]

export const mapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    city: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
      attribution:
        '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> · <a href="https://openmaptiles.org" target="_blank">OpenMapTiles</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: "void",
      type: "background",
      paint: { "background-color": "#061415" },
    },
    {
      id: "parks",
      type: "fill",
      source: "city",
      "source-layer": "landuse",
      filter: ["in", "class", "park", "cemetery", "recreation_ground"],
      paint: { "fill-color": "#0a302a", "fill-opacity": 0.7 },
    },
    {
      id: "water",
      type: "fill",
      source: "city",
      "source-layer": "water",
      paint: { "fill-color": "#051c25", "fill-outline-color": "#1c706e" },
    },
    {
      id: "road-glow",
      type: "line",
      source: "city",
      "source-layer": "transportation",
      paint: {
        "line-color": "#278e84",
        "line-opacity": 0.17,
        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 2, 17, 15],
        "line-blur": 4,
      },
    },
    {
      id: "roads",
      type: "line",
      source: "city",
      "source-layer": "transportation",
      paint: {
        "line-color": "#4cbaa7",
        "line-opacity": 0.6,
        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.4, 17, 2.3],
      },
    },
    {
      id: "footprints",
      type: "line",
      source: "city",
      "source-layer": "building",
      minzoom: 14,
      paint: {
        "line-color": "#3bd5bd",
        "line-width": 0.7,
        "line-opacity": 0.5,
      },
    },
    {
      id: "buildings",
      type: "fill-extrusion",
      source: "city",
      "source-layer": "building",
      minzoom: 14,
      filter: ["!=", ["get", "hide_3d"], true],
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "render_height"], 12],
          0,
          "#0c3d3e",
          60,
          "#147167",
          200,
          "#36bba3",
          500,
          "#8fe2c4",
        ],
        "fill-extrusion-height": ["coalesce", ["get", "render_height"], 12],
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-opacity": 0.94,
      },
    },
    {
      id: "places",
      type: "symbol",
      source: "city",
      "source-layer": "place",
      maxzoom: 15.5,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": 12,
        "text-letter-spacing": 0.12,
      },
      paint: {
        "text-color": "#75cbbd",
        "text-halo-color": "#051716",
        "text-halo-width": 2,
      },
    },
  ],
}

export function selectionGeometry(
  coordinates: [number, number],
  height: number
) {
  const [lng, lat] = coordinates
  const circle = (radius: number) =>
    Array.from({ length: 65 }, (_, i) => {
      const angle = (i / 64) * Math.PI * 2
      return [
        lng +
          (Math.cos(angle) * radius) /
            (111320 * Math.cos((lat * Math.PI) / 180)),
        lat + (Math.sin(angle) * radius) / 111320,
      ]
    })
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: { height: 3, kind: "ring" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [circle(65), circle(60).reverse()],
        },
      },
      {
        type: "Feature" as const,
        properties: { height, kind: "beam" },
        geometry: { type: "Polygon" as const, coordinates: [circle(3)] },
      },
    ],
  }
}
