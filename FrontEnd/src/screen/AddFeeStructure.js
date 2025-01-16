import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../Css/AddClassForm.css";
import { BASE_URL } from "../appconfig";
import { MdDelete } from "react-icons/md";

const AddFeeStructure = () => {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [feeGroups, setFeeGroups] = useState([{ feeType: "", amount: "", dueDate: "" }]);
  const [classList, setClassList] = useState([]);
  const [feesTypeList, setFeesTypeList] = useState([]);

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  useEffect(() => {
    fetchClasses();
    fetchFeesType();
  }, []);

  const fetchClasses = () => {
    fetch(`${BASE_URL}api/class/getAll`, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setClassList(data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        notifyError("An error occurred while fetching classes.");
      });
  };

  const fetchFeesType = () => {
    fetch(`${BASE_URL}api/fee/feetypes/getAll`, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setFeesTypeList(data);
      })
      .catch((error) => {
        console.error("Error fetching fees types:", error);
        notifyError("An error occurred while fetching fees types.");
      });
  };

  const handleFeeGroupChange = (index, field, value) => {
    const updatedFeeGroups = [...feeGroups];
    updatedFeeGroups[index][field] = value;
    setFeeGroups(updatedFeeGroups);
  };

  const handleAddFeeGroup = () => {
    setFeeGroups([...feeGroups, { feeType: "", amount: "", dueDate: "" }]);
  };

  const handleDeleteFeeGroup = (index) => {
    const updatedFeeGroups = feeGroups.filter((_, i) => i !== index);
    setFeeGroups(updatedFeeGroups);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !selectedClass || feeGroups.some((group) => !group.feeType || !group.amount || !group.dueDate)) {
      notifyError("Please fill in all fields for the fee structure and fee groups.");
      return;
    }

    const feeStructure = {
      name,
      class: selectedClass,
      feeGroups,
    };

    fetch(`${BASE_URL}api/fee/feestructure/add`, {
      method: "POST",
      headers: {
        "Authorization": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feeStructure),
    })
      .then((res) => res.json())
      .then((data) => {
        notifySuccess("Fee structure created successfully.");
      })
      .catch((error) => {
        console.error("Error creating fee structure:", error);
        notifyError("An error occurred while creating the fee structure.");
      });
  };

  return (
    <div className="add-form" style={{ width: "100%" }}>
      <h2>Create Fee Structure</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="form-control">
          <label htmlFor="class">Class:</label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            {classList.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
            ))}
          </select>
        </div>
        <div className="fee-group">
          <h3>Fee Groups:</h3>
          {feeGroups.map((group, index) => (
            <div className="fee-grp-row" key={index}>
             <div className="fee-grp-row-itemleft">
              <div style={{display:"flex",gap:"3px",width:"100%"}}>
                <label htmlFor={`feeType-${index}`} >Fee Type:</label>
                <select
                  id={`feeType-${index}`}
                  value={group.feeType}
                  onChange={(e) => handleFeeGroupChange(index, 'feeType', e.target.value)}
                  required
                >
                  <option value="">Select Fee Type</option>
                  {feesTypeList.map((feeType) => (
                    <option key={feeType._id} value={feeType.name}>{feeType.name}</option>
                  ))}
                </select>
              </div>
              <div style={{display:"flex",gap:"3px",width:"100%"}}>
                <label htmlFor={`amount-${index}`}>Amount:</label>
                <input
                  type="number"
                  id={`amount-${index}`}
                  value={group.amount}
                  onChange={(e) => handleFeeGroupChange(index, 'amount', e.target.value)}
                  required
                />
              </div>
              <div style={{display:"flex",gap:"3px",width:"100%"}}>
                <label htmlFor={`dueDate-${index}`}>Due Date:</label>
                <input
                  type="date"
                  id={`dueDate-${index}`}
                  value={group.dueDate}
                  onChange={(e) => handleFeeGroupChange(index, 'dueDate', e.target.value)}
                  required
                />
              </div>
              </div>
              <div>
                <button className="btn-dlt" type="button" onClick={() => handleDeleteFeeGroup(index)}><MdDelete /></button>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddFeeGroup}>Add Fee Group</button>
        </div>
        <button type="submit">Create Fee Structure</button>
      </form>
    </div>
  );
};

export default AddFeeStructure;
