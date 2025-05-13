import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useGlobalContext } from "../../context/globalContext";
import { NavLink, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [_, setCookies] = useCookies(["access_token"]);
  const { isSubmit, setIsSubmit } = useGlobalContext();
  var flag = false;

  const [formErrors, setFormErrors] = useState({});

  const [user, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
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
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 3) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm password and password should be same";
    }
    return error;
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    // setIsSubmit(Object.keys(errors).length === 0); // Set isSubmit to true if there are no errors
    try {
      await axios.post("http://localhost:5000/expense/register", {
        username: user.username,
        email: user.email,
        password: user.password,
      });
      const result = await axios.post("http://localhost:5000/expense/login", {
        username: user.username,
        password: user.password,
      });
      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      window.localStorage.setItem("username", result.data.username);
      navigate("/dashboard");

      // navigate("/login");
    } catch (error) {
      alert("Username already exists");
      console.log(error);
    }
  };

  // const signupHandler = async (e) => {
  //   e.preventDefault();
  //   setFormErrors(validateForm(user));
  //   console.log(Object.keys(formErrors).length);
  //   if (Object.keys(formErrors).length === 0 && isSubmit) {
  //     console.log(user);
  //     try {
  //       axios.post("http://localhost:5000/register", {
  //         username: user.username,
  //         email: user.email,
  //         password: user.password,
  //       });
  //       alert("Registration Successful");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     //   axios.post("http://localhost:9002/signup/", user).then((res) => {
  //     //     alert(res.data.message);
  //     //     navigate("/login", { replace: true });
  //     //   });
  //   }

  //setIsSubmit(true);
  // if (!formErrors) {
  //   setIsSubmit(true);
  // }
  //};

  // useEffect(() => {
  //   if (Object.keys(formErrors).length === 0 && isSubmit) {
  //     console.log(user);
  //     try {
  //       axios.post("http://localhost:5000/register", {
  //         username: user.username,
  //         email: user.email,
  //         password: user.password,
  //       });
  //       alert("Registration Successful");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     //   axios.post("http://localhost:9002/signup/", user).then((res) => {
  //     //     alert(res.data.message);
  //     //     navigate("/login", { replace: true });
  //     //   });
  //   }
  // }, [formErrors]);
  return (
    <SignUpStyled>
      <div className="signup">
        <div className="register">
          <form>
            <h1>Create Your Account</h1>
            <input
              type="text"
              name="username"
              id="fname"
              placeholder="Username"
              onChange={changeHandler}
              value={user.username}
            />
            <p className="error">{formErrors.username}</p>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={changeHandler}
              value={user.email}
            />
            <p className="error">{formErrors.email}</p>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={changeHandler}
              value={user.password}
            />
            <p className="error">{formErrors.password}</p>
            <input
              type="password"
              name="cpassword"
              id="cpassword"
              placeholder="Confirm Password"
              onChange={changeHandler}
              value={user.cpassword}
            />
            <p className="error">{formErrors.cpassword}</p>
            <button className="button_common" onClick={signupHandler}>
              Register
            </button>
            <p>
              Already registered? <NavLink to="/login"> Login</NavLink>{" "}
            </p>
          </form>
        </div>
      </div>
    </SignUpStyled>
  );
};

const SignUpStyled = styled.nav`
  .signup {
    display: flex;
    justify-content: center;
    align-item: center;
    height: 100vh;
  }
  .register {
    width: 450px;
    display: flex;
    justify-content: center;
    height: 550px;
    background: #fff;
    border: 1px solid #dddfe2;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    border-radius: 8px;
    padding: 1rem;
    margin: auto;
    align-items: center;
    text-align: center;

    input {
      border-radius: 20px;
      border: 2px solid lightgrey;
      outline: none;
      color: #1d2129;
      margin: 3% 0;
      width: 100%;
      padding: 12px;
      font-size: 16px;
    }

    h1 {
      margin: 0 0 2rem 0;
    }

    .button_common {
      background-color: olivedrab;
      color: white;
      padding: 15px 30px;
      border: none;
      font-size: 22px;
      border-radius: 15px;
      margin: 2rem 0 1rem 0;
      cursor: pointer;
      width: 70%;
    }

    .error {
      color: red;
      text-align: left;
      margin: auto;
      font-size: 16px;
      padding: 0px 1rem;
    }
  }
`;
export default SignUp;
