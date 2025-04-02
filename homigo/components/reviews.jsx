"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Image from "next/image";
import Header from "@/components/header";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
        setError("Could not load reviews.");
      }
    };

    fetchReviews();
  }, []);

  const totalReviews = reviews.length;
  const averageRating =
  totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  // Submit new review
  const addReview = async () => {
    if (!selectedRating) {
      setError("Please provide a rating");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating, text: newReviewText }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error submitting review.");

      setReviews((prev) => [result.review, ...prev]);
      setNewReviewText("");
      setSelectedRating(0);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            Reviews ({totalReviews})
            <span className="text-yellow-400 text-xl">★</span>
            <span className="text-gray-700 text-lg">{averageRating}</span>
            </h2>

            <div className="mb-6 p-4 bg-gray-100 rounded-md border border-gray-300">

            <div className="flex items-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setSelectedRating(star)}
                    className={`cursor-pointer text-2xl ${
                      (hoveredRating || selectedRating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

            {/* Review Form */}
              <textarea
                maxLength={100}
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md resize-none text-sm"
                rows={3}
                placeholder="Type your review..."
              />
              <p className="text-sm text-gray-500 mt-1">{newReviewText.length}/100</p>

              <button onClick={addReview} 
              className="mt-4 px-4 py-2 bg-black text-white font-medium rounded-md transition duration-200 hover:bg-[#3B4754]"
              disabled={selectedRating === 0 || loading}>
                {loading ? "Submitting..." : "Submit"}
                </button>



              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Review List */}
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                key={review._id}
                className="flex items-start bg-white p-4 border-2 border-gray-300 rounded-lg shadow-md w-full max-w-2xl"
              >
              
              
                  <Image
                    src="/Images/defaultUser.png"
                    alt={review.user?.name || "User"}
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold">{review.user?.name || "Anonymous"}</h3>
                    <span className="text-gray-600 text-sm">
                      {"★".repeat(review.rating).padEnd(5, "☆")} •{" "}
                      {format(new Date(review.createdAt), "MM-dd-yy hh:mm a")}
                    </span>
                    <p className="text-gray-700 text-sm mt-1 break-all whitespace-pre-wrap w-full">

  {review.text}
</p>


                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
