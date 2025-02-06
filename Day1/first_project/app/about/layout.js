import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description: "This is the about page",
};

const Aboutlayout = ({ children }) => {
  return (
    <div className="m-10">
      <nav className="text-4xl ">
        <ul className="flex gap-4">
          <li>
            <Link href="/about/mission">Mission</Link>
          </li>
          <li>
            <Link href="/about/vision">Vision</Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
};

export default Aboutlayout;
