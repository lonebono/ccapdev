// components/PropertyCard.jsx
export default function PropertyCard({ property }) {
  // Tailwind rating color mapping
  const ratingColors = {
    high: "text-green-600",
    mid: "text-yellow-500",
    low: "text-red-600",
  };

  // Determine the rating category
  const ratingClass =
    property.rating >= 4.0
      ? ratingColors.high
      : property.rating >= 2.5
      ? ratingColors.mid
      : ratingColors.low;

  return (
    <div className="border p-4 rounded-lg shadow-md hover:scale-105 transition-transform relative">
      {/* Property Image */}
      <img
        src={property.image}
        alt={property.propertytitle || "Property image"}
        className="w-full h-40 object-cover rounded-md mb-2"
        onError={(e) => (e.target.src = "/Images/default-image.png")} // Replace broken image
      />

      {/* Title & Location */}
      <h2 className="text-xl font-semibold">{property.propertytitle}</h2>
      <p className="text-gray-600">{property.location}</p>
      <p className="text-sm text-gray-500">{property.description}</p>

      {/* Price & Rating (Right Aligned with Star) */}
      <div className="flex justify-between items-center mt-1">
        <p className="font-bold">{property.price}</p>
        <div className="flex items-center">
          <p className={`font-semibold ${ratingClass} mr-1`}>
            {property.rating.toFixed(1)}
          </p>
          <span className={ratingClass}>★</span>
        </div>
      </div>

      {/* Availability & Max Guests (Right Aligned) */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-gray-700">
          Max Guests: {property.maxguests || "N/A"}
        </p>
        <p
          className={`font-semibold ${
            property.availability === "Available"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {property.availability}
        </p>
      </div>
    </div>
  );
}
