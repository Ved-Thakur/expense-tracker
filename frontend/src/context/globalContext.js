import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const BASE_URL = "http://localhost:5000/expense/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [cookies, _] = useCookies(["access_token"]);

  //calculate incomes
  const addIncome = async (income) => {
    const response = await axios
      .post(`${BASE_URL}add-income`, income)
      .catch((err) => {
        setError(err.response.data.message);
      });
    getIncomes();
  };

  const getIncomes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`, {
        headers: {
          authorization: cookies.access_token,
        },
        withCredentials: true,
      });
      setIncomes(response.data);
    } catch (err) {
      setError(err.response.data.message);
    }
    //console.log(response.data)
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-income/${id}`, {
        headers: {
          authorization: cookies.access_token,
        },
        withCredentials: true,
      });
      getIncomes();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const totalIncome = () => {
    let totalIncome = 0;
    incomes.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  //calculate incomes
  const addExpense = async (expense) => {
    const response = await axios
      .post(`${BASE_URL}add-expense`, expense)
      .catch((err) => {
        setError(err.response.data.message);
      });
    getExpenses();
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`, {
        headers: {
          authorization: cookies.access_token,
        },
        withCredentials: true,
      });
      setExpenses(response.data);
    } catch (err) {
      setError(err.response.data.message);
    }
    //console.log(response.data)
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-expense/${id}`, {
        headers: {
          authorization: cookies.access_token,
        },
      });
      getExpenses();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const totalExpenses = () => {
    let totalIncome = 0;
    expenses.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return history;
  };

  function useStateReference(value) {
    const ref = useRef(value);
    const [, forceRender] = useState(false);

    function updateState(newState) {
      if (!Object.is(ref.current, newState)) {
        ref.current = newState;
        forceRender((s) => !s);
      }
    }

    return [ref, updateState];
  }

  const [incomeInputState, setIncomeInputState] = useStateReference({
    UserID: "",
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  const [expenseInputState, setExpenseInputState] = useStateReference({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  const [check, setCheck] = useState(false);

  const handleExpenseInput = (name) => (e) => {
    setExpenseInputState({
      ...expenseInputState.current,
      [name]: e.target.value,
    });
    setError("");
  };

  const handleExpenseSubmit = (e) => {
    if (e) {
      e.preventDefault();

      const total = totalBalance();
      if (expenseInputState.current.amount > total) {
        setCheck(true);
        return;
      }
    }
    setCheck(false);
    addExpense(expenseInputState.current);
    setExpenseInputState({
      ...expenseInputState.current,
      title: "",
      amount: "",
      date: "",
      category: "",
      description: "",
    });
    getExpenses();
  };

  const handleIncomeInput = (name) => (e) => {
    setIncomeInputState({
      ...incomeInputState.current,
      [name]: e.target.value,
    });
    setError("");
  };

  const handleIncomeSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    addIncome(incomeInputState.current);
    setIncomeInputState({
      ...incomeInputState.current,
      title: "",
      amount: "",
      date: "",
      category: "",
      description: "",
    });
  };

  const useGetUserID = () => {
    return window.localStorage.getItem("userID");
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
        formErrors,
        setFormErrors,
        isSubmit,
        setIsSubmit,
        incomeInputState,
        expenseInputState,
        setIncomeInputState,
        setExpenseInputState,
        handleExpenseInput,
        handleExpenseSubmit,
        handleIncomeInput,
        handleIncomeSubmit,
        check,
        setCheck,
        useGetUserID,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
