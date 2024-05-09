import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import MainPage from './MainPage';
import LoginPage from './components/Login'
import RegistrationPage from './components/Registration'
import ProfilePage from './components/Profile';


import CollectionView from './components/Collections';
import Friendsgip from './components/Friendship';
import Friendship from './components/Friendship';


function App() {
  return (
    <Routes>

      {/* <Route path = '/' element = {<MainPage/>}> </Route> */}
      <Route path='/' element={<MainPage />}></Route>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/registration' element={<RegistrationPage />}></Route>
      <Route path='/profile' element={<ProfilePage />}></Route>
      <Route path='/friend' element={<Friendship />}></Route>

      <Route path='/collections' element={<CollectionView />}></Route>



    </Routes>
  );
}

export default App;
