import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/index";
import World from "./World/Wor.js";
import Bus from "./Business/Busi.js";
import Entertainment from "./Entertainment/Enter.js"; // Fixed typo
import Health_Sector from "./Health/Health.js";
import Nation from "./Nation/International.js";
import Science_Sector from "./Science/Science.js";
import Sports_Sector from "./Sports/Sports.js";
import Technology from "./Technology/Tech.js";
import Signin from "./Signin/login.js"; // Ensure correct case
import Subscribe from "./Sub/Sub.js"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Wor" element={<World />} />
          <Route path="/Bus" element={<Bus />} />
          <Route path="/Enter" element={<Entertainment />} /> \
          <Route path="/Health" element={<Health_Sector />} />
          <Route path="/International" element={<Nation />} />
          <Route path="/Science" element={<Science_Sector />} />
          <Route path="/Sports" element={<Sports_Sector />} />
          <Route path="/Tech" element={<Technology />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/Sub" element={<Subscribe />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
