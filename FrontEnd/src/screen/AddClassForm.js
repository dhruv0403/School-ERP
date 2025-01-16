import React, { useState, useEffect } from "react";
import "../Css/AddClassForm.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../appconfig";
import Modal from "../components/DeleteModal"; // Import the Modal component

export default function AddClassForm() {
  const [className, setClassName] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [classToDelete, setClassToDelete] = useState(null); // Store class to delete
  const navigate = useNavigate();

  // Toast function
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  // Fetch class data from API on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    fetch(`${BASE_URL}api/class/getAll`, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        notifyError("An error occurred while fetching classes.");
      });
  };

  const handleEditClick = (classData) => {
    setEditingClass(classData);
    setClassName(classData.name);
    setSelectedSections(classData.sections);
  };

  const handleDeleteClick = (classId) => {
    setClassToDelete(classId); // Store class ID to delete
    setIsModalOpen(true); // Open the modal
  };

  const confirmDelete = () => {
    if (classToDelete) {
      fetch(`${BASE_URL}api/class/delete/${classToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then(() => {
          notifySuccess("Class deleted successfully.");
          fetchClasses(); // Fetch updated class data
        })
        .catch((error) => {
          console.error("Error deleting class:", error);
          notifyError("An error occurred while deleting the class.");
        });
    }
    setIsModalOpen(false); // Close the modal
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!className || selectedSections.length === 0) {
      notifyError("Please fill in all fields.");
      return;
    }

    const method = editingClass ? "PUT" : "POST";
    const url = editingClass
      ? `${BASE_URL}api/class/update/${editingClass._id}`
      : `${BASE_URL}api/class/add`;

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: className,
        sections: selectedSections,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        notifySuccess(editingClass ? "Class updated successfully." : "Class added successfully.");
        fetchClasses(); // Fetch updated class data
        resetForm();
        setEditingClass(null); // Clear editing state after submit
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        notifyError("An error occurred while adding or updating the class.");
      });
  };

  const resetForm = () => {
    setClassName("");
    setSelectedSections([]);
  };

  const handleCheckboxChange = (e) => {
    const section = e.target.value;
    if (e.target.checked) {
      setSelectedSections([...selectedSections, section]);
    } else {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    }
  };

  return (
    <div className="class">
      <div className="add-form">
        <h1>{editingClass ? "Edit Class" : "Add Class"}</h1>
        <form id="addClassForm" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="className">Class Name</label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label>Select Sections</label>
            <div className="section-box">
              {["A", "B", "C", "D", "E", "F", "G"].map((section) => (
                <div key={section}>
                  <input
                    type="checkbox"
                    id={`section-${section}`}
                    value={section}
                    checked={selectedSections.includes(section)}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={`section-${section}`}>{`${section}`}</label>
                </div>
              ))}
            </div>
          </div>
          <input type="submit" className="btn" value={editingClass ? "Update Class" : "Add Class"} />
        </form>
      </div>
      <div className="classes-table">
        <h2>Class List</h2>
        {classes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Sections</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classData) => (
                <tr key={classData._id}>
                  <td>{editingClass && editingClass._id === classData._id ? (
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                    />
                  ) : (
                    classData.name
                  )}</td>
                  <td className="section-cell">{editingClass && editingClass._id === classData._id ? (
                    <div className="section-box">
                      {["A", "B", "C", "D", "E", "F", "G"].map((section) => (
                        <div key={section}>
                          <input
                            type="checkbox"
                            id={`edit-section-${section}`}
                            value={section}
                            checked={selectedSections.includes(section)}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor={`edit-section-${section}`}>{section}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    classData.sections.join(", ") // Display sections as a comma-separated string
                  )}</td>
                  <td>
                    {editingClass && editingClass._id === classData._id ? (
                      <button onClick={handleSubmit}>Update</button>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(classData)}>Edit</button>
                        <button className="btn-dlt" onClick={() => handleDeleteClick(classData._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No classes available.</p>
        )}
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete} 
        message="Are you sure you want to delete this class?" 
      />
    </div>
  );
}
