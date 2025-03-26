import { useEffect, useRef, useState } from 'react'
import useGeoLocation from '@/hooks/useGeoLocation'
import CommonBtn from '@/components/CommonBtn'
import styles from '@/assets/style/components/map.module.css'

// mapData.items
// restaurants: 네이버 지도 검색 api의 결과의 items 배열

const Map = () => {
  const savedMapData = sessionStorage.getItem('mapData')
  const [mapData, setMapData] = useState(savedMapData ? JSON.parse(savedMapData) : {})
  const { currentLocation, currentAddress, error: geoError, requestLocation } = useGeoLocation()
  const mapElement = useRef(null)
  const mapRef = useRef(null) // 지도 객체를 저장할 ref
  const markersRef = useRef([]) // 마커들을 저장할 ref
  const infoWindowRef = useRef(null) // InfoWindow 객체를 저장할 ref
  const [currentMarker, setCurrentMarker] = useState(mapData.items[mapData.nearestIndex])

  useEffect(() => {
    if (window.naver) {
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
        icon: {
          content: '<div style="font-size: 30px;">📍</div>',
          anchor: new naver.maps.Point(15, 15),
        },
      })
      markersRef.current.push(userMarker)
      // 음식점 마커 추가
      if (mapData.items) {
        mapData.items.forEach((item) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(item.lat, item.lng),
            map: mapRef.current,
          })
          markersRef.current.push(marker)

          // 마커 클릭 시 현재 데이터 변경
          window.naver.maps.Event.addListener(marker, 'click', () => {
            console.log('marker', marker)
            setCurrentMarker({ ...item })
          })
        })
      }
    }
  }, [])

  return (
    <div id="frame" className="naver">
      <div id="sidepanel" className={styles.info}>
        <h2 dangerouslySetInnerHTML={{ __html: `${currentMarker?.title}` }}></h2>
        <hr />
        <h3>🍴 위치</h3>
        <p>{currentMarker?.address}</p>
        <h3>🍴 대표메뉴</h3>
        <p>{currentMarker?.menu}</p>
        {/* <iframe id="iframe" src={`https://map.naver.com/p/search/${mapData.currentAddress} ${mapData.items[mapData.nearestIndex]?.title}`} title="Naver Map"></iframe> */}
        {currentMarker?.link && <CommonBtn type="a" text="자세히 보기" linkTo={currentMarker?.link} />}
      </div>
      <div ref={mapElement} className="content" />
    </div>
  )
}

export default Map
