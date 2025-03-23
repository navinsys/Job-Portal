import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";  // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import { USER_API_END_POINT } from "@/utlis/constant";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  // Handles input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log(res);  // Debugging line to check the response

      if (res.data.success) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        // ✅ Added a short delay before navigation
        setTimeout(() => {
          navigate("/");
        }, 500);  

      } else {
        toast.error(res.data.message || "Login failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }

    } catch (error) {
      console.error("Error:", error);

      // ✅ Improved error handling with fallback message
      toast.error(
        error?.response?.data?.message || "Something went wrong. Please try again.", 
     
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        
        {/* ✅ Added ToastContainer to ensure toast displays */}
        <ToastContainer />

        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>

          {/* Email Input */}
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="xyz@gmail.com"
            />
          </div>

          {/* Password Input */}
          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
            />
          </div>

          {/* Role Selection */}
          <div className="my-2">
            <Label>Role</Label>
            <div className="flex gap-4 my-2">
              <label className="flex items-center">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="mr-2"
                />
                Student
              </label>

              <label className="flex items-center">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="mr-2"
                />
                Recruiter
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full my-4">
            Login
          </Button>

          {/* Signup Link */}
          <span className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
