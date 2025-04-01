import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/index";
import World from "./World/Wo";

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
          <Route path="/Wo" element={<World />}/>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;