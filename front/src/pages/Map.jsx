import { useState } from 'react'
import { naver } from '@/api/naver'
import MapItem from '@/components/MapItem'

const Map = () => {
  const [input, setInput] = useState('')
  const [prediction, setPrediction] = useState(null)

  const handleNaverTest = async () => {
    const result = await naver(input)
    console.log('result', result)

    setPrediction(result)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-2xl font-bold">naver api test222</h1>
      <input type="text" placeholder="menu" value={input} onChange={(e) => setInput(e.target.value)} className="border p-2 rounded" />
      <button onClick={handleNaverTest} className="bg-blue-500 text-white px-4 py-2 rounded">
        Predict
      </button>

      {prediction &&
        prediction.map((item, index) => {
          return <MapItem key={index} title={item.title} />
        })}
    </div>
  )
}

export default Map
