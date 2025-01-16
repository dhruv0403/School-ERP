import React, { useEffect, useState } from "react";
import "../Css/GeneratedAdmitCards.css"; // Import the CSS file for styling
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../appconfig.js";
import ExamSchedule from "../screen/ExamSchedule.js";

const GeneratedAdmitCards = () => {
  const [students, setStudents] = useState();
  const [examSchedule, setExamSchedule] = useState([]); // To store the exam schedule
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedStudentsString = searchParams.get("selectedStudents");
  const selectedSession = searchParams.get("session");
  const selectedExamId = searchParams.get("examId");
  const selectedExamName = searchParams.get("examName");
  const selectedClassId = searchParams.get("classId");
console.log(selectedClassId);

  // Convert selectedStudentsString into an array of IDs
  const selectedStudents = selectedStudentsString
    ? selectedStudentsString.split(",")
    : [];

  useEffect(() => {
    const fetchStudentProfiles = async () => {
      try {
        const studentProfiles = [];

        for (const studentId of selectedStudents) {
          const response = await fetch(
            `${BASE_URL}api/student/getStudent/${studentId}`,
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
            studentProfiles.push(data); // Push student profile data into the array
            console.log(data); // Log student profile data
          } else {
            console.error("Error fetching student profile:", response.status);
          }
        }

        setStudents(studentProfiles);
        console.log(studentProfiles);
        return studentProfiles;
      } catch (error) {
        console.error("Error fetching student profiles:", error);
        return [];
      }
    };
    const fetchExamSchedule = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}api/admitcard/by-class-and-exam?classId=${selectedClassId}&examNameId=${selectedExamId}`,
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
        } else {
          console.error("Error fetching exam schedule:", response.status);
        }
      } catch (error) {
        console.error("Error fetching exam schedule:", error);
      }
    };

    fetchStudentProfiles();
    fetchExamSchedule();
  }, []);

  const handlePrint = () => {
    window.print();
  };
  const formatDateToIndian = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits for the day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  return (
    <div className="generated-Admit-cards">
      {/* Print button */}
      <div className="print-button">
        <button onClick={handlePrint}>Print All Admit Cards</button>
      </div>
      {students
        ? students.map((student, index) => (
          <div className="admit-card" key={index}>
            <div className="admit-card-header">
              <img
                src="https://res.cloudinary.com/dttmlghjm/image/upload/v1714852409/logo-removebg-preview_as5e3l.png"
                alt="School Logo"
                className="school-logo"
              />
              <div className="school-details">
                <h2>Satya Sai Public School</h2>
                <p className="school-address">Jakhar, Samastipur, Bihar, India - 848216</p>
                <p className="school-motto">शिक्षा है अनमोल रतन</p>
              </div>
              <div className="session">{selectedExamName} Examination, {selectedSession}</div>

            </div>

            <div className="admit-card-body">
              <img src={student.student_Photo} alt="Student Photo" className="student-photo" />
              <div className="student-details-admit" style={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Left Section */}
                <div style={{ width: '48%', paddingRight: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 'bold', border: 'none' }}>Roll Number:</td>
                        <td style={{ border: 'none' }}>{student.roll_Number}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', border: 'none' }}>Name:</td>
                        <td style={{ border: 'none' }}>{student.first_Name} {student.last_Name}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', border: 'none' }}>Father's Name:</td>
                        <td style={{ border: 'none' }}>{student.father_Name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Section */}
                <div style={{ width: '48%', paddingLeft: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 'bold', border: 'none' }}>Admission Number:</td>
                        <td style={{ border: 'none' }}>{student.admission_Number}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', border: 'none' }}>Class:</td>
                        <td style={{ border: 'none' }}>{student.class_Id.name}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', border: 'none' }}>Section:</td>
                        <td style={{ border: 'none' }}>{student.section}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {examSchedule.length > 0 && (
                <div className="exam-schedule-table">
                  <h4>Exam Schedule:</h4>
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
                      {examSchedule.map((schedule, index) => (
                        <tr key={index}>
                          <td>{schedule.subject.name}</td>
                          <td>{formatDateToIndian(schedule.date)}</td>
                          <td>{schedule.startTime}</td>
                          <td>{schedule.endTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="admit-card-footer">
              <div className="signature-section">
                <div>
                  <img
                    className="signature"
                    src="https://logomakerr.ai/uploads/output/2024/01/25/851796214d8115e381d44038dbea19b4.jpg"
                    alt="Director Signature"
                  />
                  <p className="signature-label">Director Signature</p>
                </div>
                <div>
                  <img
                    className="signature"
                    src="https://logomakerr.ai/uploads/output/2024/01/25/851796214d8115e381d44038dbea19b4.jpg"
                    alt="Principal Signature"
                  />
                  <p className="signature-label">Principal Signature</p>
                </div>
              </div>
            </div>
          </div>
        ))
        : ""}


    </div>
  );
};

export default GeneratedAdmitCards;
