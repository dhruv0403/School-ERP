import React, { useState, useEffect } from "react";
import { BASE_URL } from "../appconfig";
import { toast } from "react-toastify";
import "../Css/Assign-Subj-To-Class.css";

const SubjectClassMappingPage = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredMappings, setFilteredMappings] = useState([]); // Filtered mappings for the selected class
  const [editingMappingId, setEditingMappingId] = useState(null); // Track the mapping being edited

  // Fetch subjects and classes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classResponse, subjectsResponse] = await Promise.all([
          fetch(`${BASE_URL}api/class/getAll`, {
            headers: { Authorization: localStorage.getItem("token") },
          }),
          fetch(`${BASE_URL}api/subjects`),
        ]);

        if (!classResponse.ok || !subjectsResponse.ok) {
          throw new Error("Failed to fetch classes or subjects");
        }

        const classData = await classResponse.json();
        const subjectsData = await subjectsResponse.json();

        setClasses(classData);
        setSubjects(subjectsData);
      } catch (error) {
        toast.error("Error fetching data: " + error.message);
      }
    };

    fetchData();
    fetchMappings();
  }, []);

  // Fetch mappings
  const fetchMappings = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/subject-class-mappings`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch mappings");
      }

      const data = await response.json();
      setMappings(data);
    } catch (err) {
      toast.error("Error fetching mappings: " + err.message);
    }
  };

  useEffect(() => {
    if (selectedClassId) {
      const filtered = mappings.filter(
        (mapping) => mapping.class._id === selectedClassId
      );
      setFilteredMappings(filtered);
    } else {
      setFilteredMappings([]);
    }
  }, [selectedClassId, mappings]);

  // Handle class selection
  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
  };

  // Handle subject selection
  const handleSubjectCheckboxChange = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  // Handle form submission for creating/updating mapping
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClassId || selectedSubjects.length === 0) {
      toast.error("Please select a class and at least one subject.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = editingMappingId
        ? `${BASE_URL}api/subject-class-mappings/${editingMappingId}`
        : `${BASE_URL}api/subject-class-mappings`;
      const method = editingMappingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          classId: selectedClassId,
          subjects: selectedSubjects,
        }),
      });

      if (!response.ok) {
        throw new Error(
          editingMappingId ? "Failed to update mapping" : "Failed to create mapping"
        );
      }

      const updatedMapping = await response.json();

      if (editingMappingId) {
        // Update mappings in state
        setMappings((prev) =>
          prev.map((mapping) =>
            mapping._id === editingMappingId ? updatedMapping : mapping
          )
        );
        toast.success("Mapping updated successfully!");
      } else {
        setMappings((prev) => [...prev, updatedMapping]);
        toast.success("Subjects successfully assigned to the class!");
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setSelectedClassId("");
    setSelectedSubjects([]);
    setEditingMappingId(null);
  };

  // Handle mapping deletion
  const handleDeleteMapping = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}api/subject-class-mappings/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (!response.ok) {
        throw new Error("Failed to delete mapping");
      }

      setMappings((prev) => prev.filter((mapping) => mapping._id !== id));
      toast.success("Mapping deleted successfully!");
    } catch (err) {
      toast.error("Error deleting mapping: " + err.message);
    }
  };

  // Handle mapping edit
  const handleEditMapping = (mapping) => {
    setSelectedClassId(mapping.class._id);
    setSelectedSubjects(mapping.subjects.map((subject) => subject._id));
    setEditingMappingId(mapping._id);
  };

  return (
    <div className="subject-class-mapping-container">
    <div className="left-section">
      <h1 className="subject-class-mapping-header">Subject-Class Mapping</h1>
      <form onSubmit={handleSubmit} className="subject-class-mapping-form">
        <div>
          <label>Select Class:</label>
          <select value={selectedClassId} onChange={handleClassChange}>
            <option value="">--Select a Class--</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Subjects:</label>
          <div className="subject-checkbox-container">
            {subjects.map((subject) => (
              <div key={subject._id} className="subject-checkbox">
                <input
                  type="checkbox"
                  value={subject._id}
                  checked={selectedSubjects.includes(subject._id)}
                  onChange={() => handleSubjectCheckboxChange(subject._id)}
                />
                {subject.name}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? editingMappingId
              ? "Updating..."
              : "Assigning..."
            : editingMappingId
            ? "Update Mapping"
            : "Assign Subjects"}
        </button>

        {editingMappingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>
    </div>

    <div className="right-section">
        <h2>Existing Mappings</h2>
        <ul className="subject-class-mapping-list">
          {filteredMappings.length === 0 ? (
            <li>No mappings found for the selected class.</li>
          ) : (
            filteredMappings.map((mapping) => (
              <li key={mapping._id}>
                <strong>Class:</strong> {mapping.class.name} <br />
                <strong>Subjects:</strong>
                <ul>
                  {mapping.subjects.map((subject) => (
                    <div key={subject._id}>{subject.name}</div>
                  ))}
                </ul>
                <button onClick={() => handleEditMapping(mapping)}>Edit</button>
                <button onClick={() => handleDeleteMapping(mapping._id)}>Delete</button>
              </li>
            ))
          )}
        </ul>
      </div>
  </div>
  );
};

export default SubjectClassMappingPage;
