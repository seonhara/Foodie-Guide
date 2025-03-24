import { useState, useEffect } from 'react'
import { getRestaurantsByNaverMap } from '@/api/getRestaurantsByNaverMap'
import useGeoLocation from '@/hooks/useGeoLocation'

const useGetRestaurants = (menu, otherLocation) => {
  const [restaurants, setRestaurants] = useState(null)
  const [nearestIndex, setNearestIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { currentLocation, currentAddress, geoError = error, requestLocation } = useGeoLocation()

  const getRestaurants = async () => {
    if (!menu || !currentLocation) return // 필수 값이 없으면 실행하지 않음

    setLoading(true)
    setError(null)
    try {
      let query
      if (otherLocation) {
        query = `${otherLocation} ${menu}`
      } else {
        query = `${currentAddress} ${menu}`
      }
      const resultByNaverMap = await getRestaurantsByNaverMap(query)
      console.log('getRestaurantsByNaverMap', resultByNaverMap)

      const result = resultByNaverMap.map((item) => {
        return {
          title: item.title,
          address: item.address,
          link: item.link,
          lat: Number(item.mapy) / 10 ** 7,
          lng: Number(item.mapx) / 10 ** 7,
          // category: item.category,
          // description: item.description,
          // roadAddress: item.roadAddress,
          // telephone: item.telephone,
        }
      })

      setRestaurants(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  const calculateNearestStoreIndex = () => {
    let minDistance = 10 ** 9
    let latitude = currentLocation.lat
    let longitude = currentLocation.lng

    restaurants.forEach((item, i) => {
      let distance = (item.lat - latitude) ** 2 + (item.lng - longitude) ** 2
      if (distance < minDistance) {
        minDistance = distance
        setNearestIndex(i)
      }
    })
  }

  useEffect(() => {
    getRestaurants()
  }, [menu, currentLocation, otherLocation])

  useEffect(() => {
    if (!restaurants) return
    calculateNearestStoreIndex()
  }, [restaurants])

  return { restaurants, nearestIndex, loading, error }
}

export default useGetRestaurants
