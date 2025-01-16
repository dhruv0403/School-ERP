import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "../../Css/AddStudent.css";
import FeeStructureAccordion from "../../components/FeeStructureAccordion";
import ParentCredentialsModal from "../../components/reuse/ParentCredentialModal";
import { BASE_URL } from "../../appconfig";

import PhotoPreview from "../../components/PhotoPreview";
import AdmissionReceipt from "../../components/AdmissionReceipt";

const UpdateStudent = () => {
  const { studentId } = useParams(); // Get student ID from URL params
  const [formData, setFormData] = useState({
    admission_Number: "",
    roll_Number: "",
    first_Name: "",
    last_Name: "",
    class_Id: "",
    section: "",
    session: "",
    date_Of_Birth: "",
    gender: "",
    permanent_Address: "",
    address_For_Correspondence: "",
    contact_Number: "",
    alternet_Contact_Number: "",
    email: "",
    nationality: "India",
    religion: "",
    category: "",
    date_Of_Admission: "",
    blood_Group: "",
    father_Name: "",
    father_Occupation: "",
    mother_Name: "",
    mother_Occupation: "",
    student_Photo: null,
    aadhar_number: "",
    due_amount: "",
  });

  const [studentData, setStudentData] = useState(null); // For student profile data
  const [feeDetails, setFeeDetails] = useState(null); // For fee details data
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [classList, setClassList] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
  ]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [selectedFeeStructures, setSelectedFeeStructures] = useState([]);
  const [parentCredentials, setParentCredentials] = useState(null); // State to store parent credentials
  const [showParentCredentialsModal, setShowParentCredentialsModal] =
    useState(false); // State to manage modal visibility
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [lastAdmissionNumber, setLastAdmissionNumber] = useState(""); // State to store the last admission number
  const [isRegistering, setIsRegistering] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(true);
  const [aadharParts, setAadharParts] = useState(["", "", "", ""]);
  const [aadharNumber, setAadharNumber] = useState(""); // Final 16-digit Aadhar

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  const navigate = useNavigate();

  // Define required fields
  const requiredFields = [
    "admission_Number",
    "roll_Number",
    "class_Id",
    "section",
    "session",
    "first_Name",
    "last_Name",
    "date_Of_Birth",
    "gender",
    "permanent_Address",
    "contact_Number",
    "date_Of_Admission",
    "father_Name",
    "mother_Name",
    "student_Photo",
  ];

  useEffect(() => {

    
    const fetchFeeStructures = () => {
      fetch(`${BASE_URL}api/fee/feestructure/getAll`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFeeStructures(data);
        })
        .catch((error) => {
          console.error("Error fetching fee structures:", error);
        });
    };
    const fetchStudentProfile = async () => {
      try {
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
          fetchFeeDetails();
          setStudentData(data);
          // handleDataMapping(data);
          setFormData(data);
          console.log("student details", data);
        } else {
          console.error("Error fetching student profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };
    const fetchFeeDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}api/student/feeProfile/${studentId}`, // Update URL with the correct endpoint
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
          setFeeDetails(data);
          console.log("Fee details:", data);
        } else {
          console.error("Error fetching fee details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching fee details:", error);
      }
    };

    fetchStudentProfile();
    fetchClassData();
    fetchFeeStructures();
  
  },[]);

  const handleFeeStructures=()=>{
    if (!feeDetails || !feeDetails.feeStructures) {
      console.error("Fee details or fee structures are not available");
      return;
    }
    const newSelectedFees = feeDetails.feeStructures.map(fees => fees._id);
    console.log(newSelectedFees)
    // Update state with the new IDs, avoiding duplication
    setSelectedFeeStructures(prevSelected => [...new Set([...prevSelected, ...newSelectedFees])]);
  
    console.log("fuck")
    console.log(feeDetails);
    console.log(selectedFeeStructures);
  }
  
  useEffect(()=>{
    handleFeeStructures();
  },[feeDetails]);

  const fetchClassData = () => {
    fetch(`${BASE_URL}api/class/getAll`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClassList(data);
      })
      .catch((error) => {
        console.error("Error fetching class data:", error);
      });
  };

  const handleAadharChange = (e, index) => {
    const { value } = e.target;

    // Allow only digits and limit to 4 characters
    if (/^\d{0,4}$/.test(value)) {
      const updatedParts = [...aadharParts];
      updatedParts[index] = value;
      setAadharParts(updatedParts);
      console.log("up" + updatedParts);

      // Auto-focus to the next input if 4 digits are entered
      if (value.length === 4 && index < 3) {
        const nextInput = document.querySelector(`input[name="aadhar-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }

      // Check if all parts are filled with 4 digits
      const allPartsFilled = updatedParts.every((part) => part.length === 4);
      console.log("ap", allPartsFilled);

      // If all parts are filled, update the final Aadhar number in formData
      if (allPartsFilled) {
        const fullAadhar = updatedParts.join("");
        console.log(fullAadhar);
        setFormData((prevData) => ({ ...prevData, aadhar_number: fullAadhar })); // Directly update formData
      }
    }
  };

  console.log("Full Aadhar Number in formData:", formData.aadhar_number);


  function uploadFile(file) {
    const url = `https://api.cloudinary.com/v1_1/dcfrxghei/upload`;
    const fd = new FormData();

    fd.append("upload_preset", "myschool");

    fd.append("file", file);

    fetch(url, {
      method: "POST",
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        // File uploaded successfully
        const url = data.secure_url;
        console.log(url);
        setUrl(url);
        setFormData({
          ...formData,
          student_Photo: url,
        });
        setIsImageUploaded(true);
        toast.success("Image Upload Successfully");
      })
      .catch((error) => {
        console.error("Error uploading the file:", error);
      })
      .finally(() => {
        setIsRegistering(false); // Reset registering state after the request is complete
      });
  }



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoUpload = (e) => {
    const photo = e.target.files[0];
    setImage(photo);
    uploadFile(photo);
    // setFormData({
    //   ...formData,
    //   student_Photo: photo,
    // });
  };
  
  const handleFeeSelection = (selectedFees) => {
    setSelectedFeeStructures(selectedFees);
  };
  const postData = () => {
    if (isRegistering) return;
    setIsRegistering(true);

    // Check for required fields
    for (const field of requiredFields) {
      if (!formData[field]) {
        notifyError(`Please fill in the ${field.replace("_", " ")} field.`);
        setIsRegistering(false);
        return;
      }
    }

    if (selectedFeeStructures.length === 0) {
      notifyError("Please select at least one fee structure.");
      setIsRegistering(false);
      return;
    }

    formData["feeStructures"] = selectedFeeStructures;

    console.log("formData", formData);
    console.log("formData", JSON.stringify(formData));

    // Sending data to server
    // const formDataToSend = new FormData();

    // for (const key in formData) {
    //   formDataToSend.append(key, formData[key]);
    // }
    // console.log(formDataToSend);

    // for (const pair of formDataToSend.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

    // setRegistrationCompleted(true);


    // Sending data to server
    fetch(`${BASE_URL}api/student/updateStudent/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data.message === "Student updated successfully") {
          notifySuccess("Updated Successfully");
          navigate(`/admin/studentProfile/${studentId}`); // Redirect after successful update
        } else {
          notifyError("An error occurred while updating.");
        }
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        notifyError("An error occurred while updating.");
      })
      .finally(() => {
        setIsRegistering(false); // Enable button after request completes
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="addStudents">
      <div className="addStudentForm">
        {!registrationCompleted ? (
          <>
            <div className="form">
              <div className="form-control">
                <label htmlFor="admission_Number">
                  Admission Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="admission_Number"
                  value={formData.admission_Number}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="roll_Number">
                  Roll Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="roll_Number"
                  value={formData.roll_Number}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="first_Name">
                  First Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="first_Name"
                  value={formData.first_Name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="last_Name">
                  Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="last_Name"
                  value={formData.last_Name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">

                <label htmlFor="class_Id">
                  Class <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-control-feild"
                  name="class_Id"

                  value={formData.class_Id.name}
                  onChange={handleChange}
                >
                  <option value="">{formData.class_Id.name}</option>

                  {classList.map((classItem) => (
                    classItem.name !== formData.class_Id.name &&
                    <option
                      key={classItem._id}
                      value={classItem._id}
                      selected={classItem.name === formData.class_Id.name} // Condition for selected option
                    >
                      {classItem.name}
                    </option>
                  ))}

                </select>
              </div>

              <div className="form-control">
                <label htmlFor="section">
                  Section <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-control-feild"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                >
                  <option value="">Select Section</option>
                  {sectionOptions.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label htmlFor="session">
                  Session <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-control-feild"
                  name="session"
                  value={formData.session}
                  onChange={handleChange}
                >
                  <option value="">Select Session</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                </select>
              </div>

              <div className="form-control">
                <label htmlFor="date_Of_Birth">
                  Date of Birth <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="date"
                  name="date_Of_Birth"
                 
                  value={
                    formData.date_Of_Birth
                      ? new Date(formData.date_Of_Birth).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="gender">
                  Gender <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-control-feild"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-control">
                <label htmlFor="permanent_Address">
                  Permanent Address <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  className="form-control-feild"
                  name="permanent_Address"
                  value={formData.permanent_Address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="address_For_Correspondence">
                  Address for Correspondence<span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  className="form-control-feild"
                  name="address_For_Correspondence"
                  value={formData.address_For_Correspondence}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="contact_Number">
                  Contact Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="contact_Number"
                  value={formData.contact_Number}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="alternet_Contact_Number">
                  Alternate Contact Number
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="alternet_Contact_Number"
                  value={formData.alternet_Contact_Number}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="email">
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="nationality">
                  Nationality <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="religion">
                  Religion <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="category">
                  Category <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="date_Of_Admission">
                  Date of Admission <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="date"
                  name="date_Of_Admission"
                  value={
                    formData.date_Of_Admission
                      ? new Date(formData.date_Of_Admission).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>


              <div className="form-control">
                <label htmlFor="blood_Group">
                  Blood Group <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="blood_Group"
                  value={formData.blood_Group}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="father_Name">
                  Father Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="father_Name"
                  value={formData.father_Name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="father_Occupation">
                  Father Occupation <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="father_Occupation"
                  value={formData.father_Occupation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="mother_Name">
                  Mother Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="mother_Name"
                  value={formData.mother_Name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="mother_Occupation">
                  Mother Occupation <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="text"
                  name="mother_Occupation"
                  value={formData.mother_Occupation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label htmlFor="aadhar_number">
                  Aadhar Number <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    maxLength="3"
                    value={formData.
                      aadhar_number.substring(0,3)
                      }
                    onChange={(e) => handleAadharChange(0, e.target.value)}
                  />
                  <input
                    type="text"
                    maxLength="3"
                    value={formData.
                      aadhar_number.substring(3,6)
                      }
                    onChange={(e) => handleAadharChange(1, e.target.value)}
                  />
                  <input
                    type="text"
                    maxLength="3"
                    value={formData.
                      aadhar_number.substring(6,9)
                      }
                    onChange={(e) => handleAadharChange(2, e.target.value)}
                  />
                  <input
                    type="text"
                    maxLength="3"
                    value={formData.
                      aadhar_number.substring(9,12)
                      }
                    onChange={(e) => handleAadharChange(3, e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="student_Photo">
                  Student Photo <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control-feild"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                {<PhotoPreview image={formData?.student_Photo} />}
              </div>
              </div>
              <div className="fee-details">
              <h3>Fees Details</h3>
          <div className="fees-accordion-box">
            {feeStructures &&
              feeStructures.map((feeStructure) => (
                <FeeStructureAccordion
                  feeStructure={feeStructure}
                  onSelect={handleFeeSelection}
                  key={feeStructure._id}
                  isSelected={selectedFeeStructures.includes(feeStructure._id)}
                />
              ))}
          </div>
        </div>
              <button
                className="btn btn-primary"
                onClick={postData}
                disabled={isRegistering}
              >
                {isRegistering ? "Updating..." : "Update Student Details"}
              </button>

            
          </>
        ) : (
          <div>Student details updated successfully!</div>
        )}
      </div>
    </div>
  );
};

export default UpdateStudent;