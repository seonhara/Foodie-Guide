import { useEffect, useRef } from 'react'
import useGeoLocation from '@/hooks/useGeoLocations'

// props.restaurants
// restaurants: 네이버 지도 검색 api의 결과의 items 배열

const NaverMap = (props) => {
  const { currentLocation } = useGeoLocation()
  const mapElement = useRef(null)
  const mapRef = useRef(null) // 지도 객체를 저장할 ref
  const markersRef = useRef([]) // 마커들을 저장할 ref

  useEffect(() => {
    if (window.naver && currentLocation) {
      // 지도 초기화 (처음 한 번만 실행)
      if (!mapRef.current) {
        mapRef.current = new window.naver.maps.Map(mapElement.current, {
          center: new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
          zoom: 15,
        })
      }

      // 기존 마커 제거
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      // 현재 위치 마커 추가
      const userMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
        map: mapRef.current,
      })
      markersRef.current.push(userMarker)

      // 음식점 마커 추가
      if (props.restaurants) {
        props.restaurants.forEach((loc) => {
          const { title, mapx, mapy } = loc
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(mapy / 1e7, mapx / 1e7), // 좌표 변환 필요
            map: mapRef.current,
          })
          markersRef.current.push(marker)
        })
      }
    }
  }, [currentLocation, props.restaurants])

  return <div ref={mapElement} style={{ width: '100%', height: '500px' }} />
}

export default NaverMap
