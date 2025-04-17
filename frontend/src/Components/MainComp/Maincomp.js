import React, { useMemo, useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import Transaction from "../../ViewTransaction/Transaction";
import styled from "styled-components";
import Income from "../Income/Income";
import Expenses from "../Expenses/Expenses";
import Login from "../Login/Login";
import Orb from "../Orb/Orb";
import SignUp from "../SignUp/SignUp";
import Navigation from "../Navigation/Navigation";
import { MainLayout } from "../../styles/Layouts";
import { useGlobalContext } from "../../context/globalContext";

import alanBtn from "@alan-ai/alan-sdk-web";

function Maincomp() {
  const [active, setActive] = useState(1);

  const {
    setIncomeInputState,
    setExpenseInputState,
    handleIncomeSubmit,
    handleExpenseSubmit,
    incomeInputState,
    expenseInputState,
    click,
    isSubmit,
  } = useGlobalContext();

  // const {isSubmit} = useGlobalContext()
  // console.log(global);

  useEffect(() => {
    alanBtn({
      key: "70c6c6bc9a06b6235025e4e85702230d2e956eca572e1d8b807a3e2338fdd0dc/stage",
      host: "v1.alan.app/alanai",
      onCommand: (commandData) => {
        switch (commandData.command) {
          case "set_income_title":
            console.log("income title");
            setIncomeInputState({
              ...incomeInputState.current,
              title: commandData.data,
            });

            break;

          case "set_income_amount":
            setIncomeInputState({
              ...incomeInputState.current,
              amount: commandData.data,
            });

            break;

          case "set_income_category":
            setIncomeInputState({
              ...incomeInputState.current,
              category: commandData.data,
            });
            break;

          case "set_income_date":
            var rawDate = new Date(commandData.data);
            setIncomeInputState({
              ...incomeInputState.current,
              date: rawDate,
            });
            break;

          case "set_income_description":
            setIncomeInputState({
              ...incomeInputState.current,
              description: commandData.data,
            });
            break;

          case "income_submit":
            handleIncomeSubmit();
            break;

          case "set_expense_title":
            console.log(commandData.data);
            setExpenseInputState({
              ...expenseInputState.current,
              title: commandData.data,
            });

            break;

          case "set_expense_amount":
            setExpenseInputState({
              ...expenseInputState.current,
              amount: commandData.data,
            });

            break;

          case "set_expense_category":
            setExpenseInputState({
              ...expenseInputState.current,
              category: commandData.data,
            });
            break;

          case "set_expense_date":
            var rawDate = new Date(commandData.data);
            setExpenseInputState({
              ...expenseInputState.current,
              date: rawDate,
            });
            break;

          case "set_expense_description":
            setExpenseInputState({
              ...expenseInputState.current,
              description: commandData.data,
            });
            break;

          case "expense_submit":
            handleExpenseSubmit();
            break;
        }
      },
    });
  }, []);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Transaction />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Login />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);
  return (
    <Main>
      {orbMemo}

      {isSubmit ? (
        <MainLayout>
          <Navigation active={active} setActive={setActive} />
          <main>{displayData()}</main>
        </MainLayout>
      ) : (
        <SignUp />
      )}
    </Main>
  );
}

const Main = styled.div`
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

export default Maincomp;
