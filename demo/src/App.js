import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";

const getTransaction = (account) => [
  {
    account: "token.seeds",
    name: "transfer",
    authorization: [{ actor: account, permission: "active" }],
    data: {
      from: account,
      to: "testingseeds",
      quantity: "1 HYPHA",
      memo: "Testing ual-hypha",
    },
  },
];

function App(props) {
  const { ual = {} } = props;
  useEffect(function () {
    ual.showModal();
  }, []);
  const { activeUser } = ual;

  const transfer = async () => {
    try {
      const accountName = await activeUser.getAccountName();
      const isValid = await activeUser.isAccountValid();
      const demoTransaction = getTransaction(accountName);
      const result = await activeUser.signTransaction(demoTransaction, {
        accountName,
      });
      console.info("SUCCESS:", result);
    } catch (e) {
      console.error("ERROR:", e);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {activeUser
            ? `Authenticated as ${activeUser.accountName}`
            : "ANONYMOUS"}
        </p>

        {activeUser ? (
          <button onClick={ual.logout}>LOG OUT</button>
        ) : (
          <button onClick={ual.showModal}>LOGIN</button>
        )}

        {activeUser && <button onClick={transfer}>TEST TRANSFER</button>}
      </header>
    </div>
  );
}

export default App;
