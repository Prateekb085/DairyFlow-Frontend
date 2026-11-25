
import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

function CustomerBills() {
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API}/customers`, {
                headers
            });

            if (!response.ok) {
                throw new Error("Unable to fetch customers");
            }

            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const fetchBills = async (id) => {
        setCustomerId(id);
        setBills([]);
        setMessage("");

        if (!id) return;

        try {
            const response = await fetch(
                `${API}/customers/${id}/bills`,
                { headers }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch bills");
            }

            const data = await response.json();
            setBills(data);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    const payBill = async (bill) => {
        try {
            setLoading(true);
            setMessage("");

            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                throw new Error("Unable to load Razorpay Checkout");
            }

            // Create order from the backend
            const orderResponse = await fetch(
                `${API}/razorpay/customer-bill/${bill.id}`,
                {
                    method: "POST",
                    headers
                }
            );

            if (!orderResponse.ok) {
                throw new Error("Unable to create Razorpay order");
            }

            const order = await orderResponse.json();

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "DairyFlow",
                description: `Milk Bill #${bill.id}`,
                order_id: order.orderId,

                handler: async function (paymentResponse) {
                    try {
                        const verifyResponse = await fetch(
                            `${API}/razorpay/verify-payment`,
                            {
                                method: "POST",
                                headers,
                                body: JSON.stringify({
                                    razorpayOrderId:
                                        paymentResponse.razorpay_order_id,
                                    razorpayPaymentId:
                                        paymentResponse.razorpay_payment_id,
                                    razorpaySignature:
                                        paymentResponse.razorpay_signature
                                })
                            }
                        );

                        if (!verifyResponse.ok) {
                            throw new Error(
                                "Payment verification failed"
                            );
                        }

                        setMessage("Payment successful and verified!");
                        await fetchBills(customerId);

                    } catch (error) {
                        setMessage(error.message);
                    }
                },

                modal: {
                    ondismiss: function () {
                        setMessage("Payment window closed.");
                    }
                },

                theme: {
                    color: "#16a34a"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Customer Milk Bills</h2>

            <p>Select a customer to view their milk bills.</p>

            <select
                value={customerId}
                onChange={(e) => fetchBills(e.target.value)}
                style={styles.select}
            >
                <option value="">Select Customer</option>

                {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.mobileNumber}
                    </option>
                ))}
            </select>

            {message && (
                <p style={styles.message}>{message}</p>
            )}

            {bills.map((bill) => (
                <div key={bill.id} style={styles.card}>
                    <h3>Bill #{bill.id}</h3>

                    <p>
                        Period: {bill.fromDate} to {bill.toDate}
                    </p>

                    <p>
                        Milk Quantity: {bill.totalMilkQuantity} Litres
                    </p>

                    <p>
                        Rate: ₹{bill.ratePerLiter} / Litre
                    </p>

                    <h3>
                        Total: ₹{Number(bill.totalAmount).toFixed(2)}
                    </h3>

                    <p>
                        Status: <strong>{bill.status}</strong>
                    </p>

                    {bill.status === "PENDING" && (
                        <button
                            onClick={() => payBill(bill)}
                            disabled={loading}
                            style={styles.button}
                        >
                            {loading ? "Please wait..." : "Pay Now"}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "850px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif"
    },
    select: {
        width: "100%",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    card: {
        padding: "20px",
        marginBottom: "18px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#fff"
    },
    button: {
        padding: "11px 22px",
        background: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },
    message: {
        padding: "10px",
        background: "#f0fdf4",
        borderRadius: "6px"
    }
};

export default CustomerBills;
