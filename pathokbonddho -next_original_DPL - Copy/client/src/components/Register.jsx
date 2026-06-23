import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

function Register() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: true, // Added isAdmin field with default false
  });


  const navigate = useNavigate();

  const { storeTokenInLS } = useAuth();

  const REGISTER_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`;

  //handling the input values
  const handleInput = (e) => {
    const { name, type, checked, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value, // ✅ Always send boolean for checkboxes
    }));
  };


  //handling the from submission
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
      const response = await fetch(REGISTER_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });
      console.log("Register: ", response);

      if (response.ok) {
        const responseData = await response.json();
        alert("registration successful");
        storeTokenInLS(responseData.token);
        setUser({ username: "", email: "", phone: "", password: "", isAdmin: true });
        console.log(responseData);
        // Redirect to login page after successful registration
        navigate("/login");
      } else {
        console.log("error inside response ", "error");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container custom-font-initial col-md-4 card p-4 mt-5">
      <h2 className="text-center mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="form-control"
            id="username"
            placeholder="Username must be at least 3 chars."
            value={user.username}
            onChange={handleInput}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="email"
            placeholder="Email must be at least 3 chars."
            value={user.email}
            onChange={handleInput}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="number"
            name="phone"
            className="form-control"
            id="phone"
            placeholder="Phone must be at least 11 chars."
            value={user.phone}
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
            name="password"
            className="form-control"
            id="password"
            placeholder="Password must be at least 7 chars."
            value={user.password}
            onChange={handleInput}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isAdmin"
            className="form-check-input"
            id="isAdmin"
            checked={user.isAdmin}
            onChange={handleInput}
          />
          <label className="form-check-label" htmlFor="isAdmin">
            Register as admin
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
      <p className="text-center mt-3">
        Already have an account?{" "}
        <button
          className="btn btn-link p-0"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;