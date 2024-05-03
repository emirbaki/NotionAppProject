import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import MainPage from './NodeController';
import LoginPage from './components/Login'
import RegistrationPage from './components/Registration'
import ProfilePage from './components/Profile';
import { User } from './utils/Interfaces';


import CollectionView from './components/Collections';


function App() {
  return (
    <Routes>

      {/* <Route path = '/' element = {<MainPage/>}> </Route> */}
      <Route path='/' element={<MainPage />}></Route>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/registration' element={<RegistrationPage />}></Route>
      <Route path='/profile' element={<ProfilePage />}></Route>

      <Route path='/collections' element={<CollectionView />}></Route>



    </Routes>
  );
}

export default App;
