import { useState } from 'react'
import MapItem from '@/components/MapItem'
import NaverMap from '@/components/NaverMap'
import { getRestaurantsByNaverMap } from '@/api/getRestaurantsByNaverMap'
import { getGeoCode } from '@/api/getGeoCode'
import useGeoLocation from '@/hooks/useGeoLocations'

const Map = () => {
  const [input, setInput] = useState('')
  const [locInput, setLocInput] = useState('')
  const [restaurants, setRestaurants] = useState(null)
  const { currentLocation } = useGeoLocation()

  const handleNaverTest = async (event) => {
    event.preventDefault()
    let query
    if (locInput.length > 0) {
      query = `${locInput} ${input}`
    } else {
      const geoCode = await getGeoCode(currentLocation.lat, currentLocation.lng)
      query = `${geoCode.area1.name} ${geoCode.area2.name} ${geoCode.area3.name} ${input}`
    }
    const result = await getRestaurantsByNaverMap(query)

    setRestaurants(result)
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-10">
        <h1 className="text-2xl font-bold">naver api test222</h1>
        <form onSubmit={handleNaverTest}>
          <input type="text" placeholder="location" value={locInput} onChange={(e) => setLocInput(e.target.value)} className="border p-2 rounded" />
          <input type="text" placeholder="menu" value={input} onChange={(e) => setInput(e.target.value)} className="border p-2 rounded" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Get Restaurants</button>
        </form>
        <NaverMap restaurants={restaurants} />
        {restaurants &&
          restaurants.map((item, index) => {
            return <MapItem key={index} title={item.title} />
          })}
      </div>
    </div>
  )
}

export default Map
