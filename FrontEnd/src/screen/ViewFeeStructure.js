import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../Css/AddStudent.css";
import ViewFeeStructureAccordion from "../components/ViewFeeStructureAccordion ";
import { BASE_URL } from "../appconfig";

export default function ViewFeeStructure() {
  const navigate = useNavigate();
  const [feeStructures, setFeeStructures] = useState([]);

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const fetchFeeStructures = () => {
    fetch(`${BASE_URL}api/fee/feestructure/getAll`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFeeStructures(data);
      })
      .catch((error) => {
        console.error("Error fetching fee structures:", error);
        toast.error("Failed to fetch fee structures. Please try again.");
      });
  };

  return (
    <div className="fee-details">
      <header className="heading">Fees Details</header>
      <button onClick={fetchFeeStructures} className="refresh-button">
        Refresh Fee Structures
      </button>
      <div className="fees-accordion-box">
        {feeStructures.length > 0 ? (
          feeStructures.map((feeStructure) => (
            <ViewFeeStructureAccordion
              feeStructure={feeStructure}
              key={feeStructure._id}
            />
          ))
        ) : (
          <p>No fee structures available.</p>
        )}
      </div>
    </div>
  );
}
