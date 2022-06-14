import React, { Fragment ,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/layouts/navbar';
import Landing from './components/layouts/landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

//CSS
import './App.css';


const App = () => { 
    useEffect(() => {            
      if(localStorage.token)
        setAuthToken(localStorage.token);

      try
        {
          store.dispatch(loadUser());
        }
        catch(err)
        {
          if(err.status===401)
          console.log('User doesnot exist');
        }

    }, []);

  return (
    <Provider store={store}>
    <Router>
     <Fragment>
      <Navbar />
      <Alert />
      <Routes>
          <Route  path = '/' element={ <Landing/> } /> 
          <Route  path ='/login' element = {<Login />} />
          <Route  path ='/register' element = {<Register />} />
      </Routes>
      </Fragment> 
    </Router>
    </Provider>
  );
};
export default App;
