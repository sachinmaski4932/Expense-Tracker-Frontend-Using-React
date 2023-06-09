import { Title } from "../Titles/Titles";
import TransactionCard from "../Cards/TransactionCard";

//STYLE
import { BsTrash } from "react-icons/bs";
import styles from "../../styles/transactionComponents/DeleteTransactionForm.module.scss";

//UTILS
import { useState } from "react";
import { DateTime } from "luxon";
import {
  useTransactionDelete,
  useTransactionsGet,
} from "../../queries/transaction";
import { queryClient } from "../../constanst/config";

const DeleteTransactionForm = () => {
  const [firstDate, setFirstDate] = useState(
    DateTime.now()
      .minus({
        day: 1,
      })
      .toISODate()
  );

  const [lastDate, setLastDate] = useState(
    DateTime.now()
    .plus({
      day: 1,
    })
    .toISODate()
  );
  const { mutate: deleteTr } = useTransactionDelete();
  const {
    data,
    refetch: fetchTransactions,
    isLoading: transactionLoading,
  } = useTransactionsGet ({
    firstDate: firstDate,
    lastDate: lastDate,
    key: "Trs",
  });

  return (
    <div className={styles.container}>
      <Title>Delete a Transaction</Title>
      <div className={styles.datesearchFilter}>
        {/* FIRST DATE */}
        <div className={styles.date}>
          <label htmlFor="firstDate">From :</label>
          <input 
           type="date"
           name="firstDate"
           value={firstDate}
           onChange={(e) => setFirstDate(e.target.value)}
            />
        </div>
        {/* LAST DATE */}
        <div className={styles.date}>
          <label htmlFor="lastDate">To :</label>
          <input 
           type="date"
           name="lastDate" 
           vakue={lastDate}
           onChange={(e) => setLastDate(e.target.value)}
           />
        </div>
        {/* ACTION BUTTON */}
        <button className={styles.btn}  onClick={() => fetchTransactions()}>
          Show Transactions
        </button>
      </div>

      {/* RESULT */}
      <div className={styles.results}>
        {data &&
         data?.data.map((tr, index) =>{
          return (
          <div key={index} className={styles.container}>
            <div className={styles.delteContainer}>
              <TransactionCard
              category={tr.category.name}
              money={tr.money}
              description={`id : ${tr.id}title: ${tr.title} ${tr.info}`}
              date={DateTime.fromISO(tr.date).toISODate()}
              title={tr.title}
              />
              <div 
                 className={styles.iconContainer}
                 style={
                  transactionLoading
                  ? {
                    pointerEvents: "none",
                    background: "#333",
                  }
                  : {}
                 }
                 onClick={() => {
                  deleteTr(tr.id, {
                    onSuccess: async () => {
                      await queryClient
                       .invalidateQueries("Trs")
                       .then(await fetchTransactions())
                       .catch();
                    },
                  });
                 }}
                 >
                  <BsTrash />
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  );
};

export default DeleteTransactionForm;