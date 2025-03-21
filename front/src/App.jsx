import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Map from '@/pages/Map'
import ModelTest from '@/pages/ModelTest'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />
      <Route path="/model" element={<ModelTest />} />
    </Routes>
  )
}

export default App
