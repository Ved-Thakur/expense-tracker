import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import bg from "./img/bg.png";
import { MainLayout } from "./styles/Layouts";
import Orb from "./Components/Orb/Orb";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import Transaction from "./ViewTransaction/Transaction";
import { useGlobalContext } from "./context/globalContext";

import alanBtn from "@alan-ai/alan-sdk-web";

function App() {
  const [active, setActive] = useState(1);

  const {
    setIncomeInputState,
    setExpenseInputState,
    handleIncomeSubmit,
    click,
  } = useGlobalContext();

  useEffect(() => {
    alanBtn({
      key: "8c41e51d2f76503bb9c9e0ba5abea3322e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        switch (commandData.command) {
          case "set_income_title":
            console.log("ved", commandData.data.toLowerCase());
            setIncomeInputState((prevIncomeInputState) => ({
              ...prevIncomeInputState,
              title: commandData.data.toLowerCase(),
            }));

            break;

          case "set_income_amount":
            console.log("ved", commandData.data.toLowerCase());
            setIncomeInputState((prevIncomeInputState) => ({
              ...prevIncomeInputState,
              amount: commandData.data,
            }));

            break;

          case "set_income_category":
            setIncomeInputState((prevIncomeInputState) => ({
              ...prevIncomeInputState,
              category: commandData.data.toLowerCase(),
            }));
            break;

          case "set_income_date":
            var rawDate = new Date(commandData.data);
            setIncomeInputState((prevIncomeInputState) => ({
              ...prevIncomeInputState,
              date: rawDate,
            }));
            break;

          case "income_submit":
            click();
            // handleIncomeSubmit();
            break;

          case "set_expense_title":
            console.log(commandData.data);
            setExpenseInputState((prevExpenseInputState) => ({
              ...prevExpenseInputState,
              title: commandData.data.toLowerCase(),
            }));

            break;

          case "set_expense_amount":
            setExpenseInputState((prevExpenseInputState) => ({
              ...prevExpenseInputState,
              amount: commandData.data,
            }));

            break;

          case "set_expense_category":
            setExpenseInputState((prevExpenseInputState) => ({
              ...prevExpenseInputState,
              category: commandData.data.toLowerCase(),
            }));
            break;

          case "set_expense_date":
            var rawDate = new Date(commandData.data);
            setExpenseInputState((prevExpenseInputState) => ({
              ...prevExpenseInputState,
              date: rawDate,
            }));
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
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <button onClick={click}>click</button>
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>{displayData()}</main>
      </MainLayout>
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
