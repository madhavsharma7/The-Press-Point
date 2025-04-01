import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/index";
import World from "./World/Wor.js";

// Correct the path based on your project structure

function App() {
  return (
    // <div className="App">
    //   <Home />
    // </div>
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<Home/>} /> 
          <Route path="/Wor" element={<World />}/>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;