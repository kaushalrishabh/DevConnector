import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, { Fragment } from 'react';
import Navbar from './components/layouts/navbar';
import Landing from './components/layouts/landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
//Redux
import { Provider } from 'react-redux';
import store from './store';

const App = () => (
  <Provider store = {store}>
  <Router>
    <Fragment> 
      <Navbar />
      <Alert />
      <Routes>
        <Route exact path = '/' element={ <Landing/> } /> 
        <Route exact path ='/login' element = {<Login />} />
        <Route exact path ='/register' element = {<Register />} />
      </Routes>
    </Fragment>
  </Router>
  </Provider>
)
export default App;
