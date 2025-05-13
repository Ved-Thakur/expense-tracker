import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useGlobalContext } from "../../context/globalContext";
import { useNavigate, NavLink } from "react-router-dom";

function Login({ setUserState }) {
  const navigate = useNavigate();

  const [_, setCookies] = useCookies(["access_token"]);

  const { isSubmit, setIsSubmit } = useGlobalContext();
  const [formErrors, setFormErrors] = useState({});

  const [user, setUserDetails] = useState({
    username: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.username) {
      error.username = "username is required";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    setFormErrors(errors);
    //setIsSubmit(true);
    setIsSubmit(Object.keys(errors).length === 0); // Set isSubmit to true if there are no errors
    try {
      const result = await axios.post("http://localhost:5000/expense/login", {
        username: user.username,
        password: user.password,
      });
      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      window.localStorage.setItem("username", result.data.username);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (Object.keys(formErrors).length === 0 && isSubmit) {
  //     console.log(user);
  //     // axios.post("http://localhost:9002/login", user).then((res) => {
  //     //   alert(res.data.message);
  //     //   setUserState(res.data.user);
  //     //   navigate("/", { replace: true });
  //     // });
  //   }
  // }, [formErrors]);

  return (
    <LoginStyled className="loginOuterDiv">
      <div className="login">
        <form>
          <h1>Login</h1>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            onChange={changeHandler}
            value={user.username}
          />
          <p className="error">{formErrors.username}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
          />
          <p className="error">{formErrors.password}</p>
          <button className="button_common" onClick={loginHandler}>
            Login
          </button>
          <p className="link">
            Create Account <NavLink to="/Signup"> SignUp</NavLink>{" "}
          </p>
        </form>
      </div>
      {/* <NavLink to="/signup">Not yet registered? Register Now</NavLink> */}
    </LoginStyled>
  );
}

const LoginStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .login {
    width: 450px;
    background: #fff;
    border: 1px solid #dddfe2;
    box-shadow: 0 2px 4px rgb(0 0 10 / 64%), 0 8px 16px rgb(0 10 0 / 34%);
    border-radius: 8px;
    padding: 3rem;
    height: 500px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  // .link {
  //   display: flex;
  //   align-item: center;
  // }
  input {
    border-radius: 20px;
    border: 2px solid lightgrey;
    outline: none;
    color: #1d2129;
    margin: 15px 0;
    width: 90%;
    padding: 12px;
    font-size: 20px;
  }

  h1 {
    margin: 1rem 0 2rem 0;
    font-style: sans-serif;
  }

  .button_common {
    background-color: olivedrab;
    color: white;
    padding: 10px 30px;
    border: none;
    font-size: 25px;
    border-radius: 33px;
    margin: 2rem 0;
    width: 70%;
    cursor: pointer;
  }

  .error {
    color: red;
    text-align: left;
    margin: auto;
    font-size: 16px;
    padding: 0px 1rem;
  }

  a {
    text-decoration: none;
    color: #0563b4;
    margin-top: 10px;
    display: block;
    font-size: 16px;
  }
`;

export default Login;
