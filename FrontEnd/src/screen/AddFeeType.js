import React, { useState, useEffect } from "react";
import "../Css/AddClassForm.css";
import { toast } from "react-toastify";
import { BASE_URL } from "../appconfig";

const ManageFeeTypes = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [feeTypes, setFeeTypes] = useState([]);

    const notifyError = (msg) => toast.error(msg);
    const notifySuccess = (msg) => toast.success(msg);

    useEffect(() => {
        fetchFeeTypes();
    }, []);

    const fetchFeeTypes = () => {
        // Fetch fee types from the backend API
        // Replace the URL with your actual API endpoint
        fetch(`${BASE_URL}api/fee/feetypes/getAll`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setFeeTypes(data);
            })
            .catch((error) => {
                console.error("Error fetching fee types:", error);
                notifyError("An error occurred while fetching fee types.");
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name) {
            notifyError("Please fill in all fields.");
            return;
        }

        // Add fee type to the backend API
        // Replace the URL with your actual API endpoint
        fetch(`${BASE_URL}api/fee/feetypes/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify({
                name,
                description,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                notifySuccess("Fee type added successfully.");
                fetchFeeTypes(); // Refresh fee types list
                setName(""); // Clear the input fields
                setDescription("");
            })
            .catch((error) => {
                console.error("Error adding fee type:", error);
                notifyError("An error occurred while adding the fee type.");
            });
    };

    const deleteFeeType = (id) => {
        fetch(`${BASE_URL}api/fee/feetypes/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then((res) => res.json())
            .then((data) => {
                notifySuccess("Fee type deleted successfully.");
                fetchFeeTypes(); // Refresh the list after deletion
            })
            .catch((error) => {
                console.error("Error deleting fee type:", error);
                notifyError("An error occurred while deleting the fee type.");
            });
    };

    return (
        <div className="feesTypePage">
            <div className="add-form">
                <h2>Add Fee Type</h2>
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
                    <div className="form-control">
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}

                        />
                    </div>
                    <button className="btn" type="submit">Add Fee Type</button>
                </form>
            </div>

            <div style={{margin:"auto"}}>
                
                {feeTypes.length > 0 ? (<table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feeTypes.map((feeType) => (
                            <tr key={feeType._id}>
                                <td>{feeType.name}</td>
                                <td>{feeType.description}</td>
                                <td>
                                    <button onClick={() => deleteFeeType(feeType._id)} className="btn-dlt" >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>) : (
                    <p>No Fees Type available.</p>
                )}

            </div>
        </div>
    );
};

export default ManageFeeTypes;
