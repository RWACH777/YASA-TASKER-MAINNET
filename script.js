document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and script.js running");

  // ---- LOGIN WITH PI ----
const loginButton = document.getElementById("loginButton");
const welcomeLoginBtn = document.getElementById("welcomeLoginBtn"); // <— new button

if (loginButton) {
    console.log("login button found");
    loginButton.addEventListener("click", async () => {
        console.log("Login button clicked");
        try {
            const scopes = ["username", "payments"];
            const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);
            alert(`Login successful: ${authResult.user.username}`);
        } catch (err) {
            console.error("Login failed", err);
        }
    });

    // if the new WELCOME button exists, trigger the same click
    if (welcomeLoginBtn) {
        welcomeLoginBtn.addEventListener("click", () => loginButton.click());
    }
} else {
    console.error("Login button NOT found");
}


  // ===== PAY WITH PI =====
  const payButton = document.getElementById("payButton");
  if (payButton) {
    console.log("Pay button found");
    payButton.addEventListener("click", async () => {
      console.log("Pay button clicked");
      try {
        const paymentData = {
          amount: 1, // test 1 Pi
          memo: "Test payment from YASA TASKER",
          metadata: { jobId: "1234" }
        };

        const callbacks = {
          onReadyForServerApproval: async (paymentId) => {
            console.log("Ready for server approval:", paymentId);
            await fetch("/api/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            console.log("Ready for server completion:", paymentId, txid);
            await fetch("/api/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
          },
          onCancel: (paymentId) => {
            console.warn("Payment cancelled:", paymentId);
          },
          onError: (error, payment) => {
            console.error("Payment error:", error, payment);
          }
        };

        Pi.createPayment(paymentData, callbacks);
      } catch (err) {
        console.error("Payment failed:", err);
      }
    });
  } else {
    console.error("Pay button NOT found");
  }

  // ===== HANDLE INCOMPLETE PAYMENTS =====
  async function onIncompletePaymentFound(payment) {
    console.log("Incomplete payment found:", payment);
    // Optional: send this to your backend to resolve
  }
});