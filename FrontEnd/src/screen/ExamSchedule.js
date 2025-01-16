import React, { useState, useEffect } from "react";
import "../Css/AddClassForm.css";
import { toast } from "react-toastify";
import { BASE_URL } from "../appconfig";

const ExamSchedule = () => {
    const [name, setName] = useState("");
    const [session, setSession] = useState("");
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [editingExamId, setEditingExamId] = useState(null);
    const [classes, setClasses] = useState([]);
    const [editingScheduleIndex, setEditingScheduleIndex] = useState(null);


    useEffect(() => {
        fetchExams();
        fetchClasses();
    }, []);

    const notifyError = (msg) => toast.error(msg);
    const notifySuccess = (msg) => toast.success(msg);

    const fetchExams = () => {
        fetch(`${BASE_URL}api/exam-names/`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setExams(data);
            })
            .catch((error) => {
                console.error("Error fetching exams:", error);
                notifyError("An error occurred while fetching exams.");
            });
    };
    const fetchExamSchedules = (examId, classId) => {
        fetch(`${BASE_URL}api/exam-schedules?examId=${examId}&classId=${classId}`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setExamSchedules(data); // Set the schedules for the selected exam and class
            })
            .catch((error) => {
                console.error("Error fetching exam schedules:", error);
                notifyError("An error occurred while fetching the exam schedules.");
            });
    };

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

    const fetchSubjectsByClass = (classId) => {
        fetch(`${BASE_URL}api/subject-class-mappings/`, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                // Find the mapping for the selected classId
                const mapping = data.find((item) => item.class._id === classId);
                if (mapping) {
                    setSubjects(mapping.subjects); // Set subjects from the mapping
                } else {
                    setSubjects([]); // No mapping found for classId
                    notifyError("No subjects found for the selected class.");
                }
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
                notifyError("An error occurred while fetching subjects.");
            });
    };


    const handleExamSelection = (examId) => {
        setSelectedExam(examId);
        if (selectedClass) fetchSubjectsByClass(selectedClass);
        if (selectedClass) fetchExamSchedules(examId, selectedClass); // Fetch existing schedules
    };

    const handleClassSelection = (classId) => {
        setSelectedClass(classId);
        if (selectedExam) fetchSubjectsByClass(classId);
        if (selectedExam) fetchExamSchedules(selectedExam, classId); // Fetch existing schedules
    };

    const editSchedule = (index) => {
        setEditingScheduleIndex(index);
        // Populate fields with existing schedule details for editing
    };





    const handleScheduleSubmit = () => {
        // Handle the submission of scheduled exams
        examSchedules.forEach((schedule) => {
            fetch(`${BASE_URL}api/exam-schedules/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify(schedule),
            })
                .then((res) => res.json())
                .then(() => {
                    notifySuccess("Exam schedule added successfully.");
                })
                .catch((error) => {
                    console.error("Error adding exam schedule:", error);
                    notifyError("An error occurred while adding the exam schedule.");
                });
        });
    };
    const handleInputChange = (index, field, value, subjectId) => {
        const updatedSchedules = [...examSchedules];
        updatedSchedules[index] = {
            ...updatedSchedules[index],
            [field]: value,
            subjectId: subjectId,
            examNameId: selectedExam,
            classId: selectedClass
        };
        console.log(updatedSchedules)
        setExamSchedules(updatedSchedules);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !session) {
            notifyError("Both exam name and session are required.");
            return;
        }

        fetch(`${BASE_URL}api/exam-names/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ name, session }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to add the exam.");
                }
                return res.json();
            })
            .then(() => {
                notifySuccess("Exam added successfully.");
                fetchExams();
                setName("");
                setSession("");
            })
            .catch((error) => {
                console.error("Error adding exam:", error);
                notifyError("An error occurred while adding the exam.");
            });
    };

    const updateExam = (e) => {
        e.preventDefault();
        if (!name || !session) {
            notifyError("Both exam name and session are required.");
            return;
        }

        fetch(`${BASE_URL}api/exam-names/${editingExamId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ name, session }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to update the exam.");
                }
                return res.json();
            })
            .then(() => {
                notifySuccess("Exam updated successfully.");
                fetchExams();
                setEditingExamId(null);
                setName("");
                setSession("");
            })
            .catch((error) => {
                console.error("Error updating exam:", error);
                notifyError("An error occurred while updating the exam.");
            });
    };

    const deleteExam = (id) => {
        fetch(`${BASE_URL}api/exam-names/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to delete the exam.");
                }
                return res.json();
            })
            .then(() => {
                notifySuccess("Exam deleted successfully.");
                fetchExams();
            })
            .catch((error) => {
                console.error("Error deleting exam:", error);
                notifyError("An error occurred while deleting the exam.");
            });
    };

    const editExam = (id, currentName, currentSession) => {
        setEditingExamId(id);
        setName(currentName);
        setSession(currentSession);
    };

    const formatTime12Hour = (timeString) => {
        const date = new Date(timeString);
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', options); // Formats the time in 12-hour format with AM/PM
    }

    return (
        <>
            <div className="ExamSchedulePage feesTypePage">
                <div className="add-form">
                    <h2>{editingExamId ? "Edit Exam" : "Add Exam"}</h2>
                    <form onSubmit={editingExamId ? updateExam : handleSubmit}>
                        <div className="form-control">
                            <label htmlFor="name">Exam Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label htmlFor="session">Session:</label>
                            <input
                                type="text"
                                id="session"
                                value={session}
                                onChange={(e) => setSession(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn" type="submit">
                            {editingExamId ? "Update Exam" : "Add Exam"}
                        </button>
                    </form>
                </div>

                <div style={{margin:"auto"}}>
                    {exams.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Session</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exam) => (
                                    <tr key={exam._id}>
                                        <td>{exam.name}</td>
                                        <td>{exam.session}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    editExam(exam._id, exam.name, exam.session)
                                                }
                                                className="btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteExam(exam._id)}
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
                        <p>No exams available.</p>
                    )}
                </div>
            </div>
            <div className="ExamSchedulePage feesTypePage">
                <div className="add-form">
                    <h2>Schedule Exam</h2>
                    {/* Add the select dropdowns for Exam and Class */}
                    <div className="form-control">
                        <label htmlFor="exam">Select Exam:</label>
                        <select id="exam" onChange={(e) => handleExamSelection(e.target.value)}>
                            <option value="">Select Exam</option>
                            {exams.map((exam) => (
                                <option key={exam._id} value={exam._id}>
                                    {exam.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label htmlFor="class">Select Class:</label>
                        <select id="class" onChange={(e) => handleClassSelection(e.target.value)}>
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{overflowX:"scroll",width:"100%"}}>
                    {/* Render the table */}
                    {selectedExam && selectedClass && (
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Date</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject, index) => (
                                        <tr key={subject._id}>
                                            <td>{subject.name}</td>
                                            <td>
                                                <input
                                                    type="date"
                                                    onChange={(e) =>
                                                        handleInputChange(index, "date", e.target.value, subject._id)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    placeholder="HH:MM AM/PM"
                                                    value={examSchedules[index]?.startTime || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(index, "startTime", e.target.value, subject._id)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    placeholder="HH:MM AM/PM"
                                                    value={examSchedules[index]?.endTime || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(index, "endTime", e.target.value, subject._id)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={handleScheduleSubmit} className="btn">
                                Schedule Exams
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ExamSchedule;
