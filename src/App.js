import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage.js";
import Apply from "./components/Apply.js";
import Login from "./components/Login.js";
import Navbar from "./components/Navbar.js";
import PageNotFound from "./components/PageNotFound.js";
import Register from "./components/Register.js";
import { useState } from "react";
import Applications from "./components/Applications.js";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Navbar userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/login"
            element={
              <Login
                userLoggedIn={userLoggedIn}
                setUserLoggedIn={setUserLoggedIn}
              />
            }
          />
          <Route path="/apply" element={<Apply />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/applications"
            element={<Applications />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
