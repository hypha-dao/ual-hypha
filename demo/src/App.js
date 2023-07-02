import "./App.css";
import { useEffect } from "react";

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  
  return randomString;
}

const getTransaction = (account, isLarge = false) => ({
  actions: [
    {
      account: "hypha.hypha",
      name: "transfer",
      authorization: [{ actor: account, permission: "active" }],
      data: {
        from: account,
        to: "testingseeds",
        quantity: "0.01 HYPHA",
        memo: isLarge ? generateRandomString(2000) : "Testing ual-hypha",
      },
    },
  ],
});

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
  const testBigTx = async () => {
    try {
      const accountName = await activeUser.getAccountName();
      const isValid = await activeUser.isAccountValid();
      const demoTransaction = getTransaction(accountName, true);
      const result = await activeUser.signTransaction(demoTransaction, {
        accountName,
      });
      console.info("SUCCESS:", result);
    } catch (e) {
      console.error("ERROR:", e);
    }
  };
  const testSmallTx = async () => {
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
        {activeUser && <button onClick={testBigTx}>TEST BIG QR</button>}
        {activeUser && <button onClick={testSmallTx}>TEST SMALL QR</button>}
      </header>
    </div>
  );
}

export default App;
