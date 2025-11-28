import React from "react";

async function About() {
  const response = await fetch("https://jsonplaceholder.typicode.com/albums");
  if (!response.ok) throw new Error(" Failed to fatch data");

  const albums = await response.json();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols">
      {albums.map((albums: { id: number; title: string }) => (
        <div key={albums.id} className="bg-white shadow-md p-4 m-4 rounded-lg transition-transform hover:scale-105">
          <h3 className="text-lg font-bold mb-2">{albums.title}</h3>
          <p className="text-gray-600">Album ID: {albums.id}</p>

        </div>
      ))}
    </div>
  );
};

export default About;
