import { useEffect, useState } from "react"
import { MapContainer, GeoJSON } from "react-leaflet"
import { styled } from "@mui/material/styles"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

const MapWrapper = styled("div")(({ theme }) => ({
  height: "100%",
  width: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  boxShadow: theme.shadows[3],
  backgroundColor: "lightgray",
}))

export function SeoulMap({ onSelectGu }) {
  const [geoData, setGeoData] = useState(null)

  useEffect(() => {
    fetch(`${API}/status_map/`)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load geojson:", err))
  }, [])

  const handleEachFeature = (feature, layer) => {
    const name = feature.properties?.SIGUNGU_NM
    const code = feature.properties?.SIGUNGU_CD

    layer.on("click", () => {
      if (!code || !name) return
      onSelectGu?.({ code, name })
    })

    layer.on("mouseover", () => layer.setStyle({ weight: 2, fillOpacity: 0.6 }))
    layer.on("mouseout", () =>
      layer.setStyle({ weight: 0.5, fillOpacity: 0.3 })
    )

    layer.setStyle({
      color: "#343434ff",
      weight: 0.5,
      fillColor: "#6cacffff",
      fillOpacity: 0.3,
    })
  }

  return (
    <MapWrapper>
      <MapContainer
        center={[37.5665, 126.978]}
        zoom={11}
        minZoom={11}
        maxZoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        zoomControl={false}
        touchZoom={false}
        keyboard={false}
      >
        {geoData && (
          <GeoJSON data={geoData} onEachFeature={handleEachFeature} />
        )}
      </MapContainer>
    </MapWrapper>
  )
}
