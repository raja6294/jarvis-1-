import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Customize from "./pages/Customize.jsx";
import Home from "./pages/Home.jsx"; // make sure this exists
import { UserDataContext } from "./context/UserContext.jsx";

function App() {
  const { userData, setUserData } = useContext(UserDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />

      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />

      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />

      <Route
        path="/customize"
        element={!userData ? <Customize /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;
