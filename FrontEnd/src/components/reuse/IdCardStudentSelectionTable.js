import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

const IdCardStudentSelectionTable = ({ students }) => {
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
  const handleGenerateIdCard = () => {
    // Logic to generate ID card for selected students
    console.log("Generating ID cards for selected students:", selectedStudents);
    // Here you can send the selected students' IDs to your backend for ID card generation

    // history.push({
    //     pathname: "/admin/generateId/generatedIdCards",
    //     state: { selectedStudents: selectedStudents }
    //   });

    // Build query string for selected student IDs
    const queryString = `?selectedStudents=${selectedStudents.join(",")}`;
    // Navigate to the next page with selected student IDs as query parameters
    // window.location.href = `/admin/generateId/generatedIdCards${queryString}`;
    const destination = `/admin/generatedIdCards${queryString}`;

    return (
        <Link to={destination}>
          <button className="generate-btn">Generate ID Card</button>
        </Link>
      );
  };

  return (
    <div>
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
      {/* <button className="generate-btn" onClick={handleGenerateIdCard}>Generate ID Card</button> */}
      {handleGenerateIdCard()}
    </div>
  );
};

export default IdCardStudentSelectionTable;
// export default withRouter(IdCardStudentSelectionTable);
