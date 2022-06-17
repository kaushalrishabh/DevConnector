import React, { Fragment ,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/layouts/navbar';
import Landing from './components/layouts/landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import PrivateRoute from './components/routing/PrivateRoute';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { LOGOUT } from './actions/types';

//CSS
import './App.css';

if(localStorage.token)
setAuthToken(localStorage.token);

const App = () => { 
    useEffect(() => {            

        window.addEventListener('storage', () => {
          if (!localStorage.token) store.dispatch({ type: LOGOUT });
        });

          store.dispatch(loadUser());
    }, []);
    
  return (
    <Provider store={store}>
    <Router>
     <Fragment>
      <Navbar />
      <Alert />
      <Routes>
          <Route  path = "/" element={ <Landing /> } /> 
          <Route  path ="login" element = { <Login />} />
          <Route  path ="register" element = { <Register />} />
          <Route  path ="dashboard" element = { <PrivateRoute component ={Dashboard} />} />
          <Route  path ="create-profile" element = { <PrivateRoute component ={CreateProfile} />} />
          <Route  path ="edit-profile" element = { <PrivateRoute component ={EditProfile} />} />
      </Routes>
      </Fragment> 
    </Router>
    </Provider>
  );
};
export default App;
