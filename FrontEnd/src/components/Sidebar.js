import React, { useEffect, useState } from "react";
import "../Css/Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaBars } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import { IoPersonAdd } from "react-icons/io5";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { MdClass, MdFindInPage } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";
import { MdOutlineDynamicFeed } from "react-icons/md";
import { SiBuzzfeed } from "react-icons/si";
import { FiClipboard } from 'react-icons/fi';
import { MdAttachMoney, MdLibraryAdd, MdAssignment, MdSchedule } from "react-icons/md";
import { FaHistory, FaIdCard } from "react-icons/fa";




export default function Sidebar() {
  
  const menuItem = [
    {
      path: "/admin/home",
      name: "Dashboard",
      icon: <RiDashboardFill />,
    },
    {
      path: "/admin/addStudent",
      name: "Add Students",
      icon: <IoPersonAdd />,
    },
    {
      path: "/admin/feeStructure",
      name: "Fee Structure",
      icon: <MdAttachMoney />,
    },
    {
      path: "/admin/ViewFeeStructure",
      name: "View Fee Structure",
      icon: <MdAttachMoney />,
    },
    {
      path: "/admin/findStudent",
      name: "Find Student",
      icon: <MdFindInPage />,
    },
    {
      path: "/admin/addClass",
      name: "Class",
      icon: <MdClass />,
    },
    {
      path: "/admin/generateId",
      name: "ID Cards",
      icon: <FaRegIdCard />,
    },
    {
      path: "/admin/feeType",
      name: "Fees Type",
      icon: <MdOutlineDynamicFeed />,
    },
    {
      path: "/admin/paymentHistory",
      name: "Payment History",
      icon: <FaHistory />,
    },
    {
      path: "/admin/AddSubjects",
      name: "Add Subject",
      icon: <MdLibraryAdd />,
    },
    {
      path: "/admin/AssignSubjToClass",
      name: "Assign Subj To Class",
      icon: <MdAssignment />,
    },
    {
      path: "/admin/ExamSchedule",
      name: "Exam Schedule",
      icon: <MdSchedule />,
    },
    {
      path: "/admin/GenerateAdmitCard",
      name: "Generate Admit Card",
      icon: <FaIdCard />,
    },
  ];
  
  const [isOpen, setIsOpen] = useState(window.innerWidth>640?true:false);
  const [color,setcolor] =useState(isOpen?'white':'black');
  const [selectedPath, setSelectedPath] = useState("");
  const location = useLocation();

 
  const toggleSidebar = () => {
      setcolor((color)=>color=='black'?'white':'black');
      setIsOpen(!isOpen);
    
  };


  return (
    <>
      
<div>
<div className="mobile-toggle">
        <FaBars className="bars "
          style={{cursor: "pointer",color:`${color}`}}
          onClick={toggleSidebar} />
      </div>
      <div
        className={`sidebar-wrapper ${(isOpen)?"expanded" : "collapsed"} `}
      >   
         <div className="sidebar">
        
          <div className="top-section">
            <p style={{ display: isOpen ? "block" : "none" }}>SSPS</p>
            <div className={`arrow-wrapper `}>
              {isOpen ? (
                <FaAngleDoubleLeft
                  className="arrow"
                  style={{ cursor: "pointer" }}
                  onClick={toggleSidebar}
                />
              ) : (
                <FaAngleDoubleRight
                  className="arrow"
                  style={{ cursor: "pointer" }}
                  onClick={toggleSidebar}
                />
              )}
            </div>

          </div>
          <div className={`sidebar-menu } `}>
            {menuItem.map((item) => {
              const isSelected = location.pathname === item.path;
              const itemStyle = {
                backgroundColor: isSelected ? "#ffffff" : "inherit",
                color: isSelected ? "black" : "inherit",
                border: isSelected ? "1px solid #435569" : "inherit",
              };

              return (
                <Link to={item.path} key={item.path} className="menu-item"
                >
                  <div
                    className="option"
                    style={itemStyle}
                    onClick={() => setSelectedPath(item.path)}
                  >
                    <span className="icons">{item.icon}</span>
                    <span style={{ display: isOpen ? "block" : "none", whiteSpace: "nowrap" }}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
</div>
      
    </>


  );

}
