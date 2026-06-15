"use client";

import { MapPin, Phone, Clock } from "lucide-react";

const locations = [
  {
    id: 1,
    name: "Dhaka - Dhanmondi",
    address: "123 Dhanmondi Lake Road, Dhaka 1205",
    phone: "+880-2-XXXX-XXXX",
    hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
  },
  {
    id: 2,
    name: "Chittagong - GEC",
    address: "456 GEC Road, Chittagong 4000",
    phone: "+880-31-XXXX-XXXX",
    hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
  },
  {
    id: 3,
    name: "Sylhet - Zindabazar",
    address: "789 Zindabazar, Sylhet 3100",
    phone: "+880-821-XXXX-XXXX",
    hours: "Mon-Sat: 10AM-7PM, Sun: 12PM-5PM",
  },
  {
    id: 4,
    name: "Khulna - Khulna Sadar",
    address: "321 Khulna Sadar, Khulna 9000",
    phone: "+880-41-XXXX-XXXX",
    hours: "Mon-Sat: 10AM-7PM, Sun: 12PM-5PM",
  },
];

export default function ServiceLocations() {
  return (
    <section id="locations" className="bg-star-light-gray py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Service Center Locations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit our service centers near you for quick and professional
            support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-star-gray hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {location.name}
              </h3>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-star-blue flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm">{location.address}</p>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-star-blue flex-shrink-0" />
                  <a
                    href={`tel:${location.phone}`}
                    className="text-star-blue font-medium text-sm hover:underline"
                  >
                    {location.phone}
                  </a>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-star-blue flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm">{location.hours}</p>
                </div>
              </div>

              <button className="mt-4 w-full px-4 py-2 bg-star-blue text-white rounded-lg font-medium hover:bg-star-dark-blue transition-colors text-sm">
                Book Appointment
              </button>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center border border-star-gray">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              Interactive map will be displayed here
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
