import React from "react";

const Aboutlayout = ({ children }) => {
  return (
    <div className="m-10">
      <nav className="text-4xl ">Mission | Vision</nav>
      {children}
    </div>
  );
};

export default Aboutlayout;
