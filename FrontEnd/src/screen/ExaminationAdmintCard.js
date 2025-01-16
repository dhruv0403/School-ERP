import React, { useState, useEffect } from "react";
import IdCardStudentSelectionTable from "../components/reuse/IdCardStudentSelectionTable";
import "../Css/FindStudent.css";
import { BASE_URL } from "../appconfig";
import Sections from "../components/screens/SectionData";
import { toast } from "react-toastify";
import AdmitCardStudentSelectionTable from "../components/reuse/AdmitCardStudentSelectionTable";
import { selectClasses } from "@mui/material";

function GenerateAdmitCard() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentClass, setStudentClass] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [examId, setExamId] = useState(""); // Store the exam ID
  const [examName, setExamName] = useState("");
  const [exams, setExams] = useState([]);
  const [session, setSession] = useState("");
  const [examSchedule, setExamSchedule] = useState([]); // To store the exam schedule
  const sessionOptions = ["2023-2024", "2024-2025", "2025-2026"];
  const [dataFetched, setDataFetched] = useState(false); // Tracks if fetch action is performed


  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  const selectedExamName = exams.find((exam) => exam._id === examId)?.name; // Find the exam name from the exams list

  const fetchExamSchedule = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}api/admitcard/by-class-and-exam?classId=${studentClass}&examNameId=${examId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setExamSchedule(data);
        console.log(data)
      } else {
        console.error("Error fetching exam schedule:", response.status);
      }
    } catch (error) {
      console.error("Error fetching exam schedule:", error);
    }
  };
  useEffect(() => {
    fetchExams();
    fetchClasses();
}, []);
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
  const findStudentWithClassAndSection = () => {
    fetch(
      `${BASE_URL}api/student/byClassOrSection/${studentClass}/${studentSection}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setStudents(result);
        console.log(result);
      })
      .catch((err) => console.log(err));
  };


  const fetchClasses = () => {
    fetch(`${BASE_URL}api/class/getAll`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        // Handle error
      });
  };
  const handleExamSelection = (examId) => {
    setExamId(examId); // Save the exam ID
  };

  return (
    <div className="findStudent">
      <h2>Generate ID Cards</h2>
      <div className="findStudentForm">
        <div className="form">
          <div className="form-control">
            <label htmlFor="name">Class</label>
            <select
              id="class"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              required
            >
              <option value="">Select Class</option>
              {classes &&
                classes.map((classData) => (
                  <option key={classData._id} value={classData._id}>
                    {classData.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="section">Section</label>
            <select
              id="section"
              value={studentSection}
              onChange={(e) => setStudentSection(e.target.value)}
              required
            >
              <option value="">Select Section</option>
              {Sections.map((option) => {
                return (
                  <option key={option.id} value={option.section}>
                    {option.section}
                  </option>
                );
              })}
            </select>
          </div>
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
            <label htmlFor="section">Session</label>
            <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="">Select Session</option>
            {sessionOptions.map((session, index) => (
              <option key={index} value={session}>
                {session}
              </option>
            ))}
          </select>
          </div>

          <button
            className="btn"
            type="submit"
            onClick={() => {
              setDataFetched(true);
              findStudentWithClassAndSection();
              fetchExamSchedule()
            }}
          >
            Search
          </button>
        </div>
      </div>

      <br />
      <br />
      {/* Render the IdCardStudentSelectionTable component with the retrieved students */}
      {!dataFetched ? null : students.length > 0 && examSchedule.length > 0 ? (
          <AdmitCardStudentSelectionTable
            students={students}
            session={session}
            examId={examId}
            examName={exams.find((exam) => exam._id === examId)?.name}
            classId={studentClass}
          />
        ) : (
          <p>No students present for the selected class and section.</p>
        )}
      <br />
      <br />
      <br />
    </div>
  );
}

export default GenerateAdmitCard;
