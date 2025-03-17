import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage.js";
import Details from "./components/Details.js";
import Login from "./components/Login.js";
import Navbar from "./components/Navbar.js";
import PageNotFound from "./components/PageNotFound.js";
import Register from "./components/Register.js";
import { useState } from "react";
import SubmittedApplications from "./components/SubmittedApplications.js";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Navbar userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
        <Routes>
          <Route path="/" element={<Navigate replace to="homepage" />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route
            path="/login"
            element={
              <Login
                userLoggedIn={userLoggedIn}
                setUserLoggedIn={setUserLoggedIn}
              />
            }
          />
          <Route path="/details" element={<Details />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/submitted-applications"
            element={<SubmittedApplications />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
