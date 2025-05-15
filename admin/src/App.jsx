import React from 'react'
import Slider from './components/Slider/Slider'
import { Routes, Route } from 'react-router-dom'
import Add from './Pages/Add/Add'
import List from './Pages/List/List'
import Edit from './Pages/Edit/Edit'

const App = () => {
  return (
    <div className="app-content">
      <Slider/>
      <Routes>
        <Route path='/' element={<List />}/>
        <Route path='/add' element={<Add />}/>
        <Route path='/edit/:id' element={<Edit />}/>
      </Routes>
    </div>
  )
}

export default App
