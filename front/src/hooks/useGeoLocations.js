import { useState, useEffect } from 'react'
//  현재 위치 받아오는 hook

const useGeoLocation = (options) => {
  const [currentLocation, setCurrentLocation] = useState()
  const [error, setError] = useState('')

  const handleSuccess = (pos) => {
    const { latitude, longitude } = pos.coords

    setCurrentLocation({
      lat: latitude,
      lng: longitude,
    })
  }

  const handleError = (err) => {
    setError(err.message)
  }

  useEffect(() => {
    const { geolocation } = navigator

    if (!geolocation) {
      setError('Geolocation is not supported.')
      return
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options)
  }, [options])

  return { currentLocation, error }
}

export default useGeoLocation
