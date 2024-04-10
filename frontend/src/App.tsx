import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom'
import MainPage from './NodeController';
import LoginPage from './components/Login'

function App() {
  return (
    <Routes>

      {/* <Route path = '/' element = {<MainPage/>}> </Route> */}
      <Route path = '/' element = {<MainPage/>}></Route>
      <Route path='/login' element={<LoginPage />}></Route>

      
    </Routes>
  );
}

export default App;
