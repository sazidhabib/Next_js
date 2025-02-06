import React from "react";
import Button from "@/app/components/Button";

const About = () => {
  //   throw new Error("This is an about page error");
  return (
    <main className="flex flex-col gap-8 row-start-2  sm:items-start mt-10">
      <h1 className="text-4xl sm:text-left">About page content goes here</h1>
      <Button />
    </main>
  );
};

export default About;
