"use client";

import { useState } from "react";

export default function FilterMenu({ filters, setFilters, setPage }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFilterChange = (event) => {
    console.log("handleFilterChange is running!"); // Extra log
    const { name, value } = event.target;
    console.log("Filter changed:", name, value); // ✅ Step 1: Debug log
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value || "" }; // Ensure empty fields are handled
      console.log("✅ After state update, filters:", updatedFilters);
      return updatedFilters;
    });
    setPage(1); // Reset page whenever filters change
    console.log("Filters updated:", { ...filters, [name]: value });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-black text-white px-3 py-1.5 text-sm rounded-md hover:bg-gray-800 transition"
      >
        Filter ▼
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 max-w-xs bg-white shadow-lg rounded-md p-3 z-10 text-sm">
          <div className="mb-2">
            <label className="block text-xs font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={filters.title || ""}
              onChange={handleFilterChange}
              className="w-[50px] max-w-xs px-2 py-1 border rounded text-xs"
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs font-medium">Availability</label>
            <select
              name="availability"
              value={filters.availability || ""}
              onChange={handleFilterChange}
              className="w-full max-w-xs px-2 py-1 border rounded text-xs"
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
            </select>
          </div>

          <div className="flex space-x-2 mb-2">
            <div className="w-1/2">
              <label className="block text-xs font-medium">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice || ""}
                onChange={handleFilterChange}
                className="w-full max-w-xs px-2 py-1 border rounded text-xs"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-xs font-medium">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice || ""}
                onChange={handleFilterChange}
                className="w-full max-w-xs px-2 py-1 border rounded text-xs"
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-xs font-medium">Min Rating</label>
            <input
              type="number"
              name="rating"
              value={filters.rating || ""}
              onChange={handleFilterChange}
              className="w-full max-w-xs px-2 py-1 border rounded text-xs"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div className="flex space-x-2 mb-2">
            <div className="w-1/2">
              <label className="block text-xs font-medium">Min Guests</label>
              <input
                type="number"
                name="minGuests"
                value={filters.minGuests || ""}
                onChange={handleFilterChange}
                className="w-full max-w-xs px-2 py-1 border rounded text-xs"
                min="1"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-xs font-medium">Max Guests</label>
              <input
                type="number"
                name="maxGuests"
                value={filters.maxGuests || ""}
                onChange={handleFilterChange}
                className="w-full max-w-xs px-2 py-1 border rounded text-xs"
                min="1"
              />
            </div>
          </div>

          <button
            onClick={() =>
              setFilters({
                title: "",
                availability: "",
                minPrice: null,
                maxPrice: null,
                rating: null,
                minGuests: null,
                maxGuests: null,
              })
            }
            className="w-full bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded hover:bg-gray-400 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
