import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import IC_Google from "../../../assets/icons/IC_Google.svg";
import CommonInput from "../../../components/common/CommonInput";
import VideoLoader from "../../../components/common/VideoLoader";
import { authenticate } from "../auth.service";

const RightLoginSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const pendingRouteRef = useRef(null);
  const pendingMessageRef = useRef(null);

  const validateForm = () => {
    if (!formData.email.trim()) {
      message.error("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      message.error("Invalid email format");
      return false;
    }
    if (!formData.password.trim()) {
      message.error("Password is required");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setShowLoader(true);
    try {
      const result = await authenticate({
        email: formData.email,
        password: formData.password,
      });
      console.log('Login result:', result);
      if (result.token) {
        localStorage.setItem("token", result.token);
        console.log('Token saved:', result.token);
      } else {
        console.warn('Login succeeded but token is missing:', result);
      }
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        console.log('User saved:', result.user);
      } else {
        console.warn('Login succeeded but user data is missing:', result);
      }
      pendingRouteRef.current = "/feed";
      pendingMessageRef.current = { type: "success", text: "Login successful!" };
    } catch (error) {
      pendingMessageRef.current = {
        type: "error",
        text: error.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLoaderComplete = () => {
    setShowLoader(false);
    if (pendingMessageRef.current) {
      const { type, text } = pendingMessageRef.current;
      if (type === "success") message.success(text);
      if (type === "error") message.error(text);
      pendingMessageRef.current = null;
    }
    if (pendingRouteRef.current) {
      navigate(pendingRouteRef.current);
      pendingRouteRef.current = null;
    }
  };

  return (
    <>
      {showLoader && (
        <VideoLoader
          isLoading={loading}
          onComplete={handleLoaderComplete}
        />
      )}
      <div
      className="w-2/5 bg-[#142027] h-full gap-10 flex flex-col"
      style={{
        borderLeft: "3px solid #3c4f5d",
      }}
    >
      <div className="px-15 gap-3 w-full h-auto items-start flex flex-col pt-20">
        <div
          style={{
            fontFamily: "'SN Pro', sans-serif",
            fontSize: "20px",
            fontWeight: "500",
            color: "#F1F4F7",
          }}
        >
          Log into connectX
        </div>
        <div className="w-full gap-1 pt-5 h-auto items-start flex flex-col">
          <CommonInput
            label="Email"
            placeholder="Mobile Number, Username, Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <CommonInput
            label="Password"
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div
          className="w-full h-11 flex items-center cursor-pointer justify-center rounded-3xl bg-[#0064E0] mt-3 hover:bg-[#0050b3] transition"
          onClick={handleLogin}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? (
            <Spin size="small" style={{ color: "#fff" }} />
          ) : (
            <div className="text-white font-medium">Log In</div>
          )}
        </div>
        <div className="w-full cursor-pointer h-11 flex items-center justify-center rounded-3xl hover:bg-[#303030]">
          <div className="text-white font-medium">Forgot Password?</div>
        </div>
      </div>
      <div className="px-15 w-full h-auto items-start flex flex-col pt-10">
        <div
          className="w-full h-11 flex items-center cursor-pointer justify-center rounded-3xl hover:bg-[#303030] mt-3"
          style={{
            border: "1px solid #939393",
          }}
        >
          <div className="h-full w-11 p-2.5 flex items-center justify-center">
            <img src={IC_Google} alt="" />
          </div>
          <div className="text-white font-medium">Login with Google</div>
        </div>
        <div
          className="w-full h-11 flex gap-2 items-center cursor-pointer justify-center rounded-3xl mt-3 hover:bg-[#303030]"
          style={{
            border: "1px solid #4598fe",
          }}
          onClick={() => navigate("/signup")}
        >
          <div className="text-[#4598fe] font-medium">Create new Account</div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RightLoginSection;
