import './App.css';
import React, {fragment} from 'react';
import Navbar from './components/layouts/navbar';
import Landing from './components/layouts/landing';

const App = () => (
  <fragment> 
      <Navbar />
      <Landing />
  </fragment>
  

)
export default App;
