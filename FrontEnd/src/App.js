import React, { useState } from 'react';
import LoginForm from "./screen/LoginForm";
import AdminDashboard from "./screen/AdminDashboard";
import ParentDashboard from "./screen/ParentDashboard";
import AddStudent from './screen/AddStudent';
import Home from './components/Home';
import AddClassForm from './screen/AddClassForm';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { dividerClasses } from '@mui/material';
import ManageFeeTypes from './screen/AddFeeType';
import AddFeeStructure from './screen/AddFeeStructure';
import FindStudent from './screen/FindStudent';
import GenerateIdCard from './screen/GenerateIdCard';
import PaymentHistory from './screen/PaymentHistory';
import StudentProfile from './screen/student details/StudentProfile';
import GeneratedIdCards from './components/GeneratedIdCards';
import FeeReceipt from './components/FeesReceipt';
import UpdateStudentDeatils from './screen/student details/UpdateStudentDetails'
import ViewFeeStructure from './screen/ViewFeeStructure';
import GenerateAdmitCard from './screen/ExaminationAdmintCard';
import GeneratedAdmitCards from './components/GeneratedAdmitCards';
import SubjectManagement from './screen/AddSubjects';
import AssignSubjToClass from './screen/AssignSubjToClass';
import ExamSchedule from './screen/ExamSchedule';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginForm />
    },
    // {
    //   path: "/admin",
    //   element: <AdminDashboard />
    // },
    {
      path: "/admin",
      element: <AdminDashboard />,

      children: [
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "addStudent",
          element: <AddStudent />,
        },
        {
          path: "addClass",
          element: <AddClassForm />,
        },
        {
          path: "feeType",
          element: <ManageFeeTypes />,
        },
        {
          path: "feeStructure",
          element: <AddFeeStructure />,
        },
        {
          path: "ViewFeeStructure",
          element: <ViewFeeStructure />,
        },
        {
          path: "findStudent",
          element: <FindStudent />,
        },
        {
          path: "generateId",
          element: <GenerateIdCard />,
        },
        {
          path: "generatedIdCards",
          element: <GeneratedIdCards />,
        },
        {
          path: "generatedAdmitCards",
          element: <GeneratedAdmitCards />,
        },
        {
          path: "paymentHistory",
          element: <PaymentHistory />,
        },
        {
          path: "studentProfile/:studentId",
          element: <StudentProfile />,
        },
        {
          path: "UpdateStudentDetails/:studentId",
          element: <UpdateStudentDeatils />,
        },
        {
          path: "GenerateAdmitCard",
          element: <GenerateAdmitCard/>
        },
        {
          path: "AddSubjects",
          element: <SubjectManagement/>
        },
        {
          path: "AssignSubjToClass",
          element: <AssignSubjToClass/>
        },
        {
          path: "ExamSchedule",
          element: <ExamSchedule/>
        }

      ],
    },
    {
      path: "/parent",
      element: <ParentDashboard />
    },
    {
      path: "/addStudent",
      element: <AddStudent />
    },
    {
      path: "feeReceipt/:paymentId",
      element: <FeeReceipt />,
    }
  ]);

  return (

    <RouterProvider router={router} />



  );
}

export default App;
