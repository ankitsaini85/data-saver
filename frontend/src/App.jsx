// import React from 'react';
// import Home from './pages/Home';
// import './App.css';

// function App() {
//   return <Home />;
// }

// export default App;

import React from "react";

function App() {
  const handlePayment = async () => {
    const res = await fetch("http://localhost:5000/create-checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (!data.success) {
      alert("Payment session failed");
      console.log(data);
      return;
    }

    const token = data.token;

    window.tazapay.checkout({
      clientToken: token,
      callbacks: {
        onPaymentSuccess: () => {
          alert("Payment Success ✅");
        },
        onPaymentFail: () => {
          alert("Payment Failed ❌");
        },
      },
    });
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Tazapay Test</h1>
      <button onClick={handlePayment}>
        Pay ₹200
      </button>

      {/* Checkout UI will render here */}
      <div id="tz-checkout"></div>
    </div>
  );
}

export default App;