import React, { useState, useContext } from "react";
import bg from "../assets/image.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";


function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const ctx = useContext(UserDataContext);
  const serverURL = ctx?.serverURL ?? "http://localhost:8000";
  const { setUserData } = ctx;

  


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [err,setErr]=useState("");


  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverURL}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setLoading(false);
      setUserData(res.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setUserData(null);
      setLoading(false)
      navigate("/customize")
      if (error.response && error.response.data && error.response.data.message) {
    setErr(error.response.data.message);
  } else {
    setErr("password must be at least 6 characters long");
  }

    }
  };

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
        onSubmit={handleSignUp}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000036] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-5 p-5 rounded-2xl"
      >
        <h1 className="text-white text-[30px]">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        {/* PASSWORD FIELD */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <span
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-[22px] cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {err.length>0 && <p className="text-red-500">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="min-w-[150px] h-[60px] rounded-full bg-white text-black font-semibold text-[19px]"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="text-white mt-2 text-[16px]">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-400 hover:underline hover:text-blue-300 transition"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
