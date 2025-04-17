import React from "react";
import History from "../History/History";
import styled from "styled-components";
import { dateFormat } from "../utils/dateFormat";
import { calender, comment, dollar } from "../utils/Icons";
import { useGlobalContext } from "../context/globalContext";
const Transaction = () => {
  const { transactionHistory } = useGlobalContext();

  const [...history] = transactionHistory();
  return (
    <TransactionStyled>
      <h1>Transactions</h1>
      {history.map((item) => {
        const { _id, title, amount, type, date, description } = item;
        console.log(dollar);
        return (
          <div className="List">
            <div key={_id} className="history-item">
              <div>
                <h2>
                  <p
                    style={{
                      color: type === "expense" ? "red" : "var(--color-green)",
                    }}
                  >
                    {title}
                  </p>
                </h2>

                <div className="text">
                  <p>
                    {calender} {dateFormat(date)}
                  </p>
                  <p>
                    {comment}
                    {description}
                  </p>
                </div>
              </div>
              <div className="amount">
                <p
                  style={{
                    color: type === "expense" ? "red" : "var(--color-green)",
                  }}
                >
                  {type === "expense"
                    ? `- ₹${amount <= 0 ? 0 : amount}`
                    : `+ ₹${amount <= 0 ? 0 : amount}`}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </TransactionStyled>
  );
};

const TransactionStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;

  .history-item {
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    text-transform: capitalize;
    .text {
      display: flex;
      align-items: center;
      gap: 2rem;
      p {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary-color);
        opacity: 0.8;
      }
    }

    .amount {
      font-size: 1.5rem;
      font-weight: 800;
    }
  }
`;

export default Transaction;
