import { useEffect, useState } from 'react'
import { getGeoCode } from '@/api/getGeoCode'

const useGeoLocation = (options) => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.5665, lng: 126.978 })
  const [currentAddress, setCurrentAddress] = useState('')
  const [error, setError] = useState('')

  const getcurrentAddress = async (latitude, longitude) => {
    const geoCode = await getGeoCode(latitude || currentLocation.lat, longitude || currentLocation.lng)
    const address = `${geoCode.area1.name} ${geoCode.area2.name} ${geoCode.area3.name}`
    console.log('address', address)

    setCurrentAddress(address)
  }

  const handleSuccess = async (pos) => {
    const { latitude, longitude } = pos.coords
    setCurrentLocation({ lat: latitude, lng: longitude })
    await getcurrentAddress(latitude, longitude)
    console.log('??', latitude, longitude)
  }

  const handleError = (err) => {
    if (error.code === error.PERMISSION_DENIED) {
      setError('사용자 위치 권한을 허용으로 설정해주세요.')
    } else {
      setError(err.message)
    }
    console.log('err', err.message)
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('위치 공유를 지원하지 않는 브라우저입니다.')
      return
    }

    const defaultOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    }

    // 사용자가 버튼을 눌렀을 때 위치 요청 실행 → 팝업이 자동으로 뜸
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options || defaultOptions)
    console.log('??', navigator.geolocation)
  }

  useEffect(() => {
    getcurrentAddress()
    // requestLocation()
  }, [])

  // useEffect(() => {
  //   // console.log('currentLocation', currentLocation)
  //   // console.log('currentAddress', currentAddress)
  //   // getcurrentAddress()
  //   // const latitude = currentLocation?.lat ? currentLocation.lat : 37.5665 //  위도 (서울)
  //   // const longitude = currentLocation?.lng ? currentLocation.lng : 126.978 // 경도 (서울)
  //   // setCurrentLocation({ lat: latitude, lng: longitude })
  // }, [currentLocation])

  return { currentLocation, currentAddress, error, requestLocation }
}

export default useGeoLocation
