import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/index";
import Bus from "./Business/Busi.js";
import Entertainment from "./Entertainment/Enter.js";
import HealthSector from "./Health/Health.js";
import ScienceSector from "./Science/Science.js";
import SportsSector from "./Sports/Sports.js";
import Technology from "./Technology/Tech.js";
import Signin from "./Signin/login.js";
import Subscribe from "./Sub/Sub.js";
import Articlesave from "./ArticleSave/Save.js";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Bus" element={<Bus />} />
          <Route path="/Enter" element={<Entertainment />} /> \
          <Route path="/Health" element={<HealthSector />} />
          <Route path="/Science" element={<ScienceSector />} />
          <Route path="/Sports" element={<SportsSector />} />
          <Route path="/Tech" element={<Technology />} />
          <Route path="/Login" element={<Signin />} />
          <Route path="/Sub" element={<Subscribe />} />
          <Route path="/Save" element={<Articlesave />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
