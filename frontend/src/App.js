import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import bg from "./img/bg.png";
import SignUp from "./Components/SignUp/SignUp";
import Maincomp from "./Components/MainComp/Maincomp";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import { useGlobalContext } from "./context/globalContext";

function App() {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const { isSubmit, setIsSubmit } = useGlobalContext();
  useEffect(() => {
    const checkAuth = async () => {
      const token = cookies.access_token;
      if (!token) return; // No token, user is not logged in

      try {
        // Verify token with backend (optional but recommended)
        const response = await axios.post(
          "http://localhost:5000/expense/verify-token",
          {
            headers: { Authorization: token },
          }
        );

        if (response.status === 200) {
          setIsSubmit(true);
          // Optional: Fetch fresh user data if needed
        }
      } catch (error) {
        console.error("Token invalid or expired:", error);
        // Clear invalid token
        setCookies("access_token", "", { expires: new Date(0) });
        localStorage.removeItem("userID");
        localStorage.removeItem("username");
      }
    };

    checkAuth();
  }, [cookies.access_token]);
  // hello world
  return (
    <AppStyled bg={bg} className="App">
      <Routes>
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Maincomp />} />
      </Routes>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
