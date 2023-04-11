import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../zustand/store";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const loginRegisterUser = useStore((state) => state.loginRegisterUser);

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const username = isLogin ? null : event.target.username.value;

    const success = await loginRegisterUser(email, password, username);
    if (success) {
      navigate("/home");
    } else {
      alert("Error");
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center">
      <div className="login-form">
        <h1 className="text-light">{isLogin ? "Login" : "Register"}</h1>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-between h-25"
        >
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
          {!isLogin && (
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              required
            />
          )}

          <button type="submit" className="btn btn-secondary">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          type="button"
          className="btn btn-link text-light"
          onClick={switchForm}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
