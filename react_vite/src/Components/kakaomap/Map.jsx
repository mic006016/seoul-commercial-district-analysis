import { useEffect, useRef } from "react"

export default function Map({ selectedGu, selectedDong }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return
    const { kakao } = window
    if (!kakao || !kakao.maps) {
      console.error("Kakao Maps SDK not loaded")
      return
    }

    kakao.maps.load(() => {
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 근처
        level: 9,
      }

      const map = new kakao.maps.Map(mapRef.current, options)
      mapInstanceRef.current = map
    })
  }, [])

  useEffect(() => {
    const { kakao } = window
    const map = mapInstanceRef.current
    if (!kakao || !kakao.maps || !map) return

    // 아무것도 선택 안 했으면 그냥 둠
    if (!selectedGu && !selectedDong) return

    const geocoder = new kakao.maps.services.Geocoder()

    // 동이 있으면 구+동, 없으면 구만 검색
    const keyword = selectedDong
      ? `서울특별시 ${selectedGu} ${selectedDong}`
      : `서울특별시 ${selectedGu}`

    geocoder.addressSearch(keyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x)

        map.setCenter(coords)

        if (selectedDong) {
          map.setLevel(5) // 필요하면 4, 6 등으로 조정해봐도 됨
        } else if (selectedGu) {
          map.setLevel(7)
        }

        // 마커 위치 설정
        if (markerRef.current) {
          markerRef.current.setPosition(coords)
        } else {
          markerRef.current = new kakao.maps.Marker({
            map,
            position: coords,
          })
        }
      } else {
        console.warn("Geocoding failed:", status)
      }
    })
  }, [selectedGu, selectedDong])

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
}
