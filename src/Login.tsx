import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [input, setInput] = useState({
    user: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  };
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    const { user, password } = input;
    event.preventDefault();
    try {
      const res = await fetch("http://localhost:3005/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: "include",
        body: JSON.stringify({ user, password }),
      });
      console.log("Response:", res);

      if (res.status == 201) {
        const data = await res.json();
        console.log(data);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      } else {
        // Handle errors
        const data = await res.json();
        toast.error(data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-3xl mb-5">Cnic tracker</h1>
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div className="px-5 py-7">
            <label className="font-semibold text-xl text-gray-600 pb-1 block">
              User
            </label>
            <input
              type="text"
              name="user"
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              onChange={handleChange}
            />
            <label className="font-semibold text-xl text-gray-600 pb-1 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              onChange={handleChange}
            />
            <button
              onClick={handleSubmit}
              type="button"
              className="mt-5 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2 text-xl mt">Login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4 inline-block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="py-5">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-center sm:text-left whitespace-nowrap"></div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
