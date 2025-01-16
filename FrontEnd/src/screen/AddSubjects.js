import React, { useState, useEffect } from "react";
import "../Css/AddClassForm.css";
import { toast } from "react-toastify";
import { BASE_URL } from "../appconfig";

const SubjectManagement = () => {
    const [name, setName] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [editingSubjectId, setEditingSubjectId] = useState(null);


    useEffect(() => {
        fetchSubjects();
    }, []);

    const notifyError = (msg) => toast.error(msg);
    const notifySuccess = (msg) => toast.success(msg);

    const fetchSubjects = () => {
        fetch(`${BASE_URL}api/subjects/`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setSubjects(data);
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
                notifyError("An error occurred while fetching subjects.");
            });
    };

    const editSubject = (id, currentName) => {
      setEditingSubjectId(id);
      setName(currentName);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (!name) {
          notifyError("Subject name is required.");
          return;
      }
          // Add new subject
          fetch(`${BASE_URL}api/subjects/`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
              },
              body: JSON.stringify({ name }),
          })
              .then((res) => {
                  if (!res.ok) {
                      throw new Error("Failed to add the subject.");
                  }
                  return res.json();
              })
              .then(() => {
                  notifySuccess("Subject added successfully.");
                  fetchSubjects(); // Refresh the subjects list
                  setName(""); // Clear the form field
              })
              .catch((error) => {
                  console.error("Error adding subject:", error);
                  notifyError("An error occurred while adding the subject.");
              });
  };
  const updateSubject = (e) => {
    e.preventDefault();
    if (!name) {
        notifyError("Subject name is required.");
        return;
    }

    fetch(`${BASE_URL}api/subjects/${editingSubjectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ name }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to update the subject.");
            }
            return res.json();
        })
        .then(() => {
            notifySuccess("Subject updated successfully.");
            fetchSubjects();
            setEditingSubjectId(null);
            setName("");
        })
        .catch((error) => {
            console.error("Error updating subject:", error);
            notifyError("An error occurred while updating the subject.");
        });
  };

  const deleteSubject = (id) => {
      fetch(`${BASE_URL}api/subjects/${id}`, {
          method: "DELETE",
          headers: {
              Authorization: localStorage.getItem("token"),
          },
      })
          .then((res) => {
            console.log(res) 
              if (!res.ok) {
                  throw new Error("Failed to delete the subject.");
              }
              return res.json();
          })
          .then(() => {
              notifySuccess("Subject deleted successfully.");
              fetchSubjects(); // Refresh the list after deletion
          })
          .catch((error) => {
              console.error("Error deleting subject:", error);
              notifyError("An error occurred while deleting the subject.");
          });
  };

   

    return (
        <div className="subjectManagementPage feesTypePage">
            <div className="add-form">
                <h2>Add Subject</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label htmlFor="name">Subject Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn" type="submit">
                        Add Subject
                    </button>
                </form>
            </div>

            <div style={{margin:"auto"}}>
                {subjects.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {subjects.map((subject) => (
                                <tr key={subject._id}>
                                    <td>{editingSubjectId === subject._id ? (
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    ) : (
                                        subject.name
                                    )}</td>
                                    <td>
                                        {editingSubjectId === subject._id ? (
                                            <button onClick={updateSubject} >
                                                Update
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => editSubject(subject._id, subject.name)}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteSubject(subject._id)}
                                            className="btn-dlt"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No subjects available.</p>
                )}
            </div>
        </div>
    );
};

export default SubjectManagement;
