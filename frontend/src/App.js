import "./App.css";
import React from "react";
import LoginPage from "./components/login/Login";
import HomePage from "./components/home/Home";
import GamePage from "./components/gamepage/Game";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
