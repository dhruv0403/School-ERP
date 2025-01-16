  import React, { useState } from "react";
  import { Link, withRouter } from "react-router-dom";

  const AdmitCardStudentSelectionTable = ({ students, session ,examId, examName,classId }) => {
    console.log(examName,classId);
    
    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleSelectStudent = (studentId) => {
      if (selectedStudents.includes(studentId)) {
        setSelectedStudents(selectedStudents.filter(id => id !== studentId));
      } else {
        setSelectedStudents([...selectedStudents, studentId]);
      }
    };

    const handleSelectAll = () => {
      if (selectedStudents.length === students.length) {
        // If all are selected, deselect all
        setSelectedStudents([]);
      } else {
        // Otherwise, select all
        setSelectedStudents(students.map(student => student._id));
      }
    };
  

    const handleGenerateAdmitCard = () => {
      // Logic to generate ID card for selected students
      console.log("Generating ID cards for selected students:", selectedStudents);
      // Here you can send the selected students' IDs to your backend for ID card generation

      // history.push({
      //     pathname: "/admin/generateId/generatedAdmitCards",
      //     state: { selectedStudents: selectedStudents }
      //   });

      // Build query string for selected student IDs
      const queryString = `?selectedStudents=${selectedStudents.join(",")}&session=${session}&examId=${examId}&examName=${examName}&classId=${classId}`;
      // Navigate to the next page with selected student IDs as query parameters
      // window.location.href = `/admin/generateId/generatedAdmitCards${queryString}`;
      const destination = `/admin/generatedAdmitCards${queryString}`;

      return (
          <Link to={destination}>
            <button className="generate-btn">Generate Admit Card</button>
          </Link>
        );
    };

    return (
      <div style={{width:"100%",overflowX:"scroll"}}>
        <table>
          <thead>
            <tr>
              <th>
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length && students.length > 0}
                onChange={handleSelectAll}
              />
              </th>
              <th>Name</th>
              <th>ADM NO</th>
              <th>Roll No.</th>
              
              <th>Class</th>
              <th>Section</th>
              <th>F Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    value={student._id}
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleSelectStudent(student._id)}
                  />
                </td>
                <td>
                  <Link
                    to={`/admin/studentProfile/${student._id}`}
                    key={student._id}
                    className="link-items"
                  >
                    {student.first_Name} {student.last_Name}
                  </Link>
                </td>
                <td>{student.admission_Number}</td>
                <td>{student.roll_Number}</td>
                
                <td>{student.class_Id.name}</td>
                <td>{student.section}</td>
                <td>{student.father_Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <button className="generate-btn" onClick={handleGenerateAdmitCard}>Generate Admit Card</button> */}
        {handleGenerateAdmitCard()}
      </div>
    );
  };

  export default AdmitCardStudentSelectionTable;
  // export default withRouter(AdmitCardStudentSelectionTable);
