import logo from './logo.svg';
import './App.css';

import Home from "./Home/index"

import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <div id="container">
      <Home />
    </div>

    // <BrowserRouter>
    //   <div className='App'>
    //     <Routes>
    //       <Route  element={<Home />} />
      
    //     </Routes>
    //   </div>
    // </BrowserRouter>


  );
}

export default App;
