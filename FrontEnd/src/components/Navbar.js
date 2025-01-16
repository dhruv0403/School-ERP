import React from "react";
import "../Css/navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">


      {/* <input type="checkbox" id="check" />
      <label htmlFor="check" className="checkbtn">
        <i className="fas fa-bars"></i>
      </label>
      <label className="logo">Satya Sai Public School, Jakhar</label> */}
      <p className="title">Satya Sai Public School, Jakhar</p>
      <ul>
        <li><a className="active" target="blank" href="https://sspsjakhar.in/">Site</a></li>
      
       
      </ul>

    </nav>

  );
}
