import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";


const LOGIN_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { storeTokenInLS } = useAuth();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(LOGIN_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert("Login successful");

        if (!responseData.hasOwnProperty("isAdmin")) {
          console.error("isAdmin is missing from the server response:", responseData);
          alert("Error: Admin status is missing from the server response.");
          return;
        }
        // Ensure responseData includes 'isAdmin' (adjust if API uses another field name)
        storeTokenInLS(responseData.token, responseData.isAdmin);

        setUser({ email: "", password: "" });
        navigate("/admin");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.log("error");
    }
    // Add your login logic here
    console.log("Logging in with:", email, password);
    // Redirect to another page after login (e.g., dashboard)
    navigate("/admin"); // Replace with your desired route
  };

  return (
    <div className="container custom-font-initial col-md-4  card p-4  mt-5">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={handleInput}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={handleInput}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
      <p className="text-center mt-3">
        Don't have an account?{" "}
        <button
          className="btn btn-link p-0"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;