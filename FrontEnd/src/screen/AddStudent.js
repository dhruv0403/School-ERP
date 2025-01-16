import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "../Css/AddStudent.css";
import FeeStructureAccordion from "../components/FeeStructureAccordion";
import ParentCredentialsModal from "../components/reuse/ParentCredentialModal";
import { BASE_URL } from "../appconfig";

import PhotoPreview from "../components/PhotoPreview";
import AdmissionReceipt from "../components/AdmissionReceipt";

const AddStudent = () => {
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
  const [isImageUploaded, setIsImageUploaded] = useState(false);
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
    "category"
  ];

  useEffect(() => {
    fetchClassData();
    fetchFeeStructures();
    fetchLastAdmissionNumber();
  }, []);

  const fetchLastAdmissionNumber = () => {
    fetch(`${BASE_URL}api/student/getLastAdmissionNumber`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("data", data);
        console.log(
          "data.lastAdmissionNumber",
          data.lastGeneratedAdmissionNumber
        );
        setLastAdmissionNumber(data.lastGeneratedAdmissionNumber); // Set the last admission number in state
      })
      .catch((error) => {
        console.error("Error fetching last admission number:", error);
      });
  };

 const handleAadharChange = (e, index) => {
  const { value } = e.target;
  
  // Allow only digits and limit to 4 characters
  if (/^\d{0,3}$/.test(value)) {
    const updatedParts = [...aadharParts];
    updatedParts[index] = value;
    setAadharParts(updatedParts);
    console.log("up" + updatedParts);

    // Auto-focus to the next input if 3 digits are entered
    if (value.length === 3 && index < 3) {
      const nextInput = document.querySelector(`input[name="aadhar-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }

    // Check if all parts are filled with 3 digits
    const allPartsFilled = updatedParts.every((part) => part.length === 3);
    console.log("ap" , allPartsFilled);
    
    // If all parts are filled, update the final Aadhar number in formData
    if (allPartsFilled) {
      const fullAadhar = updatedParts.join("");
      console.log(fullAadhar);
      setFormData((prevData) => ({ ...prevData, aadhar_number: fullAadhar })); // Directly update formData
    }
  }
};
console.log("Full Aadhar Number in formData:", formData.aadhar_number);

  
  
  

  // Update admission number in form data whenever last admission number changes
  useEffect(() => {
    if (lastAdmissionNumber && !formData.admission_Number) {
      console.log("lastAdmis",lastAdmissionNumber)
      const numericPart = parseInt(lastAdmissionNumber.match(/\d+/)[0], 10);
      console.log("numb",numericPart)
      const newAdmissionNumber = `AD-${numericPart}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        admission_Number: newAdmissionNumber,
      }));
    }
  }, [lastAdmissionNumber]);
  


  const handleFeeSelection = (selectedFees) => {
    setSelectedFeeStructures(selectedFees);
    console.log(selectedFeeStructures)
  };

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

  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years

  const handleDobChange = (field, value) => {
    const newDob = { ...dob, [field]: value };
    setDob(newDob);

    // If day, month, and year are selected, format and store in formData
    if (newDob.day && newDob.month && newDob.year) {
      const formattedDob = `${String(newDob.day).padStart(2, '0')}-${String(newDob.month).padStart(2, '0')}-${newDob.year}`;
      setFormData((prevData) => ({
        ...prevData,
        date_Of_Birth: formattedDob,
      }));
      console.log(formData.date_Of_Birth)
    }
  };

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

    fetch(`${BASE_URL}api/student/addStudent`, {
      method: "POST",
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
        // Check if student was successfully created
        if (data.message === "Student and Parent created successfully") {
          notifySuccess("Registered Successfully");
          setRegistrationCompleted(true); // Set the state to indicate registration completion
        } else {
          notifyError("An error occurred while registering.");
        }
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error("Error posting data:", error);
        notifyError("An error occurred while registering.");
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
              value={formData.class_Id}
              onChange={handleChange}
            >
              <option value="">Select Class</option>
              {classList.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
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
            <div className="dob-inputs">
            <label>
              Date of Birth <span style={{ color: "red" }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={dob.day}
            onChange={(e) => handleDobChange('day', e.target.value)}
          >
            <option value="">DD</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {String(day).padStart(2, '0')}
              </option>
            ))}
          </select>

          <select
            value={dob.month}
            onChange={(e) => handleDobChange('month', e.target.value)}
          >
            <option value="">MM</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {String(month).padStart(2, '0')}
              </option>
            ))}
          </select>

          <select
            value={dob.year}
            onChange={(e) => handleDobChange('year', e.target.value)}
          >
            <option value="">YYYY</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {String(year).padStart(4, '0')}
              </option>
            ))}
          </select>
          </div>
        </div>
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
            <input
              className="form-control-feild"
              type="text"
              name="permanent_Address"
              value={formData.permanent_Address}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label htmlFor="address_For_Correspondence">
              Address for Correspondence
            </label>
            <input
              className="form-control-feild"
              type="text"
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
            <label htmlFor="alternet_Contact_Number">Alternate Contact Number</label>
            <input
              className="form-control-feild"
              type="text"
              name="alternet_Contact_Number"
              value={formData.alternet_Contact_Number}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              className="form-control-feild"
              id="email-input"
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
  <select
    className="form-control-feild"
    name="category"
    value={formData.category}
    onChange={handleChange}
  >
    <option value="">Select Category</option>
    <option value="General">General</option>
    <option value="OBC">OBC</option>
    <option value="SC">SC</option>
    <option value="ST">ST</option>
  </select>
</div>

<div className="form-control">
  <label htmlFor="blood_Group">
    Blood Group <span style={{ color: "red" }}>*</span>
  </label>
  <select
    className="form-control-feild"
    name="blood_Group"
    value={formData.blood_Group}
    onChange={handleChange}
  >
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
  </select>
</div>

<div className="form-control">
  <label htmlFor="father_Name">
    Father's Name <span style={{ color: "red" }}>*</span>
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
    Father's Occupation <span style={{ color: "red" }}>*</span>
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
    Mother's Name <span style={{ color: "red" }}>*</span>
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
    Mother's Occupation <span style={{ color: "red" }}>*</span>
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
  <label htmlFor="due_amount">
    Due Amount <span style={{ color: "red" }}>*</span>
  </label>
  <input
    className="form-control-feild"
    type="text"
    name="due_amount"
    value={formData.due_amount}
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
              id="admiDate-input"
              name="date_Of_Admission"
              value={formData.date_Of_Admission}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label htmlFor="student_Photo">
              Student Photo <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="form-control-feild"
              accept="image/*"
              type="file"
              name="student_Photo"
              id="student_Photo"
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="form-control">
            <label htmlFor="aadhar_number">
              Aadhar Number <span style={{ color: "red" }}>*</span>
            </label>
            <div className="aadhar-input">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  name={`aadhar-${index}`}
                  value={aadharParts[index]}
                  onChange={(e) => handleAadharChange(e, index)}
                  maxLength="3"
                  className="aadhar-box"
                  placeholder="000"
                />
              ))}
            </div>
          </div>
          <div className="photo-preview-container">
          <label className="photo-preview-label">Photo Preview</label>
          <div className="photo-preview-container">
            <PhotoPreview image={image} />
          </div>
        </div>
        </div>

        <div className="fee-details">
          <header className="heading">Fees Details</header>
          <div className="fees-accordion-box">
            {feeStructures &&
              feeStructures.map((feeStructure) => (
                <FeeStructureAccordion
                  feeStructure={feeStructure}
                  onSelect={handleFeeSelection}
                  isSelected={selectedFeeStructures.includes(feeStructure._id)}
                  key={feeStructure._id}
                />
              ))}
          </div>
        </div>
      </>
    ) : (
      <>
        <Link to="/admin/addStudent" reloadDocument>
        <button className="btn-print">
          Add new Student
        </button>
        </Link>
        <button className="btn-print" onClick={handlePrint}>
          Print
        </button>
        <AdmissionReceipt studentData={formData} />
      </>
    )}
    {!registrationCompleted && (
      <input
        className="btn-register"
        type="submit"
        value="Register"
        onClick={postData}
        disabled={!isImageUploaded || isRegistering}
        style={{
          pointerEvents: !isImageUploaded || isRegistering ? "none" : "auto",
          background: !isImageUploaded || isRegistering ? "red" : "",
          opacity: !isImageUploaded || isRegistering ? 0.2 : 1,
        }}
      />
    )}
  </div>
</div>
  );
};

export default AddStudent;

