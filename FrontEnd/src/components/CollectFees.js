import React, { useState, useEffect } from "react";
import "../Css/Checkout.css";
import { toast } from "react-toastify";
import { BASE_URL } from "../appconfig";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";

const CollectFees = ({
    studentName,
    studentID,
    grade,
    billingContact,
    feesData,
    section,
    roll_Number,
    closeModal,
}) => {
    const [amount, setAmount] = useState(350);
   
    const navigate = useNavigate();
    const handleClose = () => {
        closeModal(false);
    };

    useEffect(() => {
        // Calculate and set the total amount and tax once when the component mounts or feesData changes
        const totalAmount = calculateTotalAmount(feesData);
        
     
        setAmount(totalAmount );
    }, [feesData]); // Only re-run the effect if feesData changes

    const calculateTotalAmount = (selectedItems) => {
        // Initialize total amount to 0
        let totalAmount = 0;

        // Iterate over each selected item
        selectedItems.forEach((item) => {
            // Convert the amount to a number if it's a string
            const amount =
                typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;

            // Add the amount of each item to the total amount
            totalAmount += amount;
        });

        // Return the total amount
        return totalAmount;
    };

    // handlePayment Function
    const handleFeeCollection = async () => {
        try {
            const res = await fetch(`${BASE_URL}api/payment/collect-fee`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    amountPaid:amount,
                    studentId:studentID,
                    paymentMethod:"CASH",
                    feePaid:feesData
                }),
            });

            const paymentdata = await res.json();
            console.log(paymentdata)
            if (paymentdata.success) {
                toast.success(paymentdata.message);

                navigate(`/feeReceipt/${paymentdata.payment._id}`);
            }
            
        } catch (error) {
            console.log(error);
        }
    }
 



    return (
        <div className="modal-overlay">
            <div className="container">
                <div className="header">
                    <div style={{ position: "absolute", top: "0", right: "0", color: "red", cursor: "pointer" }}>
                        <IoIosCloseCircle fontSize={28} onClick={handleClose} />
                    </div>
                    <h2>CollectFees - SSPS</h2>
                    <p>Please review your payment details</p>
                </div>
                <div className="receipt">
                    <div className="receipt-item">
                        <label>Student Name:</label>
                        <span>{studentName}</span>
                    </div>
                    <div className="receipt-item">
                        <label>Roll No:</label>
                        <span>{roll_Number}</span>
                    </div>
                    <div className="receipt-item">
                        <label>Class:</label>
                        <span>
                            {grade} <span>{section}</span>{" "}
                        </span>
                    </div>
                    <div className="receipt-item">
                        <label>Payment Method:</label>
                        <span>Offline</span>
                    </div>

                    <div className="receipt-item">
                        <label> Contact :</label>
                        <span>{billingContact}</span>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Fee Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feesData.map((fee, index) => (
                            <tr key={index}>
                                <td>{fee.feeType}</td>
                                <td>₹{fee.amount}</td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
                <div className="receipt-item receipt-total">
                    <label>Total :</label>
                    <span> ₹ {amount.toFixed(2)}</span>
                </div>
           
                <button onClick={handleFeeCollection} className="button">
                    Collect Fees
                </button>
            </div>
        </div>
    );
};

export default CollectFees;
