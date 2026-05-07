"use client";

import { useState } from "react";

const parts = [
  { id: "cpu", name: "Processor", options: ["Intel i9", "AMD Ryzen 9", "Intel i7"] },
  { id: "gpu", name: "Graphics Card", options: ["RTX 4090", "RTX 4080", "RX 7900 XTX"] },
  { id: "ram", name: "Memory", options: ["32GB DDR5", "64GB DDR5", "16GB DDR5"] },
];

export default function SetupBuilderPage() {
  const [selectedParts, setSelectedParts] = useState<Record<string, string>>({});
  const totalPrice = Object.keys(selectedParts).length * 500;

  return (
    <main className="min-h-screen bg-star-light-gray text-star-text pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Gaming Setup Builder</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {parts.map((part) => (
            <div key={part.id} className="bg-white border border-star-gray rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{part.name}</h3>
              <div className="grid grid-cols-3 gap-3">
                {part.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedParts({ ...selectedParts, [part.id]: option })}
                    className={`px-4 py-2 rounded border text-sm transition-colors ${
                      selectedParts[part.id] === option
                        ? "bg-star-blue text-white border-star-blue"
                        : "border-star-gray hover:bg-star-light-gray"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-star-gray rounded-lg p-6 h-fit sticky top-24">
          <h3 className="text-xl font-semibold mb-6">Your Setup</h3>
          {Object.entries(selectedParts).length > 0 ? (
            <ul className="space-y-3 mb-6">
              {Object.entries(selectedParts).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="text-gray-600">{key.toUpperCase()}</span>
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-6">Select parts to build your setup</p>
          )}
          <div className="border-t border-star-gray pt-6">
            <div className="flex justify-between text-xl font-semibold mb-6">
              <span>Total</span>
              <span className="text-star-blue">${totalPrice}</span>
            </div>
            <button className="w-full py-3 bg-star-blue text-white rounded hover:bg-star-dark-blue transition-colors font-semibold">
              Save Setup
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
