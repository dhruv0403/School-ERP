import React, { useState } from 'react';
import '../Css/Accordion.css';

const ViewFeeStructureAccordion = ({ feeStructure, updateFeeGroup, deleteFeeGroup }) => {
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [editMode, setEditMode] = useState(null); // Track editable row
    const [editableData, setEditableData] = useState({}); // Track changes to row data


    const handleEditClick = (feeGroup) => {
        setEditMode(feeGroup._id);
        setEditableData(feeGroup); // Populate editable data with current values
    };

    const handleUpdateClick = async () => {
        await updateFeeGroup(editableData); // Call API to update data
        setEditMode(null); // Exit edit mode after update
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await deleteFeeGroup(id); // Call API to delete data
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableData({ ...editableData, [name]: value }); // Update editable data
    };

    return (
        <>
            {feeStructure && (
                <div key={feeStructure._id}>
                    <div className="accordion">
                        <div onClick={() => setIsActive(!isActive)}>
                            {feeStructure.name}
                        </div>
                    </div>
                    {isActive && (
                        <div className={`panel ${activeAccordion === feeStructure._id ? 'active' : ''}`}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fee Type</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeStructure.feeGroups.map((feeGroup) => (
                                        <tr key={feeGroup._id}>
                                            <td>
                                                {editMode === feeGroup._id ? (
                                                    <input
                                                        type="text"
                                                        name="feeType"
                                                        value={editableData.feeType}
                                                        onChange={handleChange}
                                                    />
                                                ) : (
                                                    feeGroup.feeType
                                                )}
                                            </td>
                                            <td>
                                                {editMode === feeGroup._id ? (
                                                    <input
                                                        type="number"
                                                        name="amount"
                                                        value={editableData.amount}
                                                        onChange={handleChange}
                                                    />
                                                ) : (
                                                    feeGroup.amount
                                                )}
                                            </td>
                                            <td>
                                                {editMode === feeGroup._id ? (
                                                    <input
                                                        type="date"
                                                        name="dueDate"
                                                        value={new Date(editableData.dueDate).toISOString().split('T')[0]}
                                                        onChange={handleChange}
                                                    />
                                                ) : (
                                                    new Date(feeGroup.dueDate).toLocaleDateString()
                                                )}
                                            </td>
                                            <td>
                                                {editMode === feeGroup._id ? (
                                                    <button onClick={handleUpdateClick}>Update</button>
                                                ) : (
                                                    <button onClick={() => handleEditClick(feeGroup)}>Edit</button>
                                                )}
                                                <button onClick={() => handleDeleteClick(feeGroup._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ViewFeeStructureAccordion;
