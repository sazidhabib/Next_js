"use client";
import React from "react";

export default function Button() {
  return (
    <button
      className="bg-green-500 rounded-md p-3"
      onClick={() => console.log("i have click here.")}
    >
      Click here
    </button>
  );
}
