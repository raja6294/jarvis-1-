// SignIn.jsx
import React, { useState, useContext } from "react";
import bg from "../assets/image.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const ctx = useContext(UserDataContext);
  const serverURL = ctx?.serverURL ?? "http://localhost:8000";

  const [email, setEmail] = useState("");

  const [loading, setLoading]= useState(false);

  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverURL}/api/auth/signin`,
        { email, password },              // <-- send only email & password
        { withCredentials: true }
      );
      setUserData(res.data);
      setLoading(false);
      navigate("/home")

      console.log("signin response:", res.data);

      
      if (res.data && res.data.token) {
        setErr("");                       
        localStorage.setItem("token", res.data.token);
        
        navigate("/");                    
      } else {
        
        setErr(res.data?.message || "Invalid email or password");
      }
    } catch (error) {
      console.log("signin error:", error);
      setUserData(null)
      setLoading(false);

      // prefer backend message if present
      if (error.response?.data?.message) {
        setErr(error.response.data.message);
      } else {
        setErr("Invalid email or password");
      }
    }
  };

  // background style
  const bgStyle = {
    backgroundImage: `url('${bg}')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  return (
    <div className="w-full flex justify-center items-center" style={bgStyle}>
      <form
        onSubmit={handleSignIn}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000036] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] p-[20px] rounded-2xl"
      >
        <h1 className="text-white text-[30px]">
          SignIn to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
          required
          onChange={(e) => {
            setEmail(e.target.value);
            if (err) setErr("");    // <-- clear old error when user types
          }}
          value={email}
        />

        {/* PASSWORD FIELD */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full text-[18px]"
            required
            onChange={(e) => {
              setPassword(e.target.value);
              if (err) setErr("");    // <-- clear old error when user types
            }}
            value={password}
          />
          <span
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-[22px] cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {err && <p className="text-red-500">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="min-w-[150px] h-[60px] rounded-full bg-white text-black font-semibold text-[19px]"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="text-white mt-2 text-[16px]">
          Want to create a new account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:underline hover:text-blue-300 transition"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
