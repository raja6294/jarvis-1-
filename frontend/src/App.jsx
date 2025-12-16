import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Customize from "./pages/Customize.jsx";
import Customize2 from "./pages/Customize2.jsx";
import Home from "./pages/Home.jsx";
import { UserDataContext } from "./context/UserContext.jsx";

function App() {
  const { userData } = useContext(UserDataContext);

  const isLoggedIn = !!userData;
  const isSetupComplete =
    userData?.assistantImage && userData?.assistantName;

  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            isSetupComplete ? (
              <Home />
            ) : (
              <Navigate to="/customize" replace />
            )
          ) : (
            <Navigate to="/signup" replace />
          )
        }
      />

      {/* AUTH */}
      <Route
        path="/signup"
        element={!isLoggedIn ? <SignUp /> : <Navigate to="/customize" replace />}
      />

      <Route
        path="/signin"
        element={!isLoggedIn ? <SignIn /> : <Navigate to="/customize" replace />}
      />

      {/* SETUP FLOW */}
      <Route
        path="/customize"
        element={
          isLoggedIn ? (
            <Customize />
          ) : (
            <Navigate to="/signup" replace />
          )
        }
      />

      <Route
        path="/customize2"
        element={
          isLoggedIn ? (
            <Customize2 />
          ) : (
            <Navigate to="/signup" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
