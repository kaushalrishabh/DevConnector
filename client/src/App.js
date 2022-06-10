import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, {fragment} from 'react';
import Navbar from './components/layouts/navbar';
import Landing from './components/layouts/landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App = () => (
  <Router>
    <fragment> 
      <Navbar />
      <Routes>
        <Route exact path = '/' element={ <Landing/> } /> 
        <Route exact path ='/login' element = {<Login />} />
        <Route exact path ='/register' element = {<Register />} />
      </Routes>
    </fragment>
  </Router>

)
export default App;
