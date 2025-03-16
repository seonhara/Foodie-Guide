import { useState } from 'react'
import { recommendations } from '@/api/recommendations'
import MapItem from '@/components/MapItem'

const ModelTest = () => {
  const [recommendResult, setRecommendResult] = useState([])
  const [features, setFeatures] = useState({
    location: 'Seoul',
    budget: 20000,
    cuisine: 'Korean',
  })

  const handleModle = async () => {
    const result = await recommendations(features)
    console.log('result', result)

    setRecommendResult(result.recommendations)
  }

  return (
    <div>
      <h1>추천 음식점</h1>
      <button onClick={handleModle}>추천 받기</button>
      <ul>{recommendResult && recommendResult.map((place, index) => <li key={index}>{place}</li>)}</ul>
    </div>
  )
}

export default ModelTest
