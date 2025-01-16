import React from 'react';
import { Link } from 'react-router-dom';

const StudentTable = ({ students }) => {
    return (
        <div style={{width:"100%",overflowX:"scroll"}}>

            <table>
                <thead>
                    <tr>
                        <th>ADM NO</th>
                        <th>Roll No.</th>

                        <th>Name</th>
                        

                        <th>Class</th>
                        <th>Section</th>
                        
                        <th>Phone Number</th>
                        <th>F Name</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td>{student.admission_Number}</td>
                            <td>{student.roll_Number}</td>
                            {/* <td>{student.first_Name} {student.last_Name}</td> */}
                            
                            <td>
                                <Link to={`/admin/studentProfile/${student._id}`} key={student._id} className='link-items'>
                                    {student.first_Name} {student.last_Name}
                                </Link>
                            </td>


                            <td>{student.class_Id.name}</td>
                            <td>{student.section}</td>
                            



                            <td>{student.contact_Number}</td>





                            <td>{student.father_Name}</td>






                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
