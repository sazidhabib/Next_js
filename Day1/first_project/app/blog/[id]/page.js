import { notFound } from "next/navigation";
import React from "react";

const Blogpage = ({ params }) => {
  const { id, contant } = params;

  if (id === "3") {
    notFound(); // This will return a 404 page
  }

  return (
    <div className="m-10">
      Blogpage
      <h1>Blogpage {id}</h1>
      <p>{contant}</p>
    </div>
  );
};

export default Blogpage;
