import { connectMongoDB } from "@/lib/mongodb";
import Review from "@/models/reviews";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET: Fetch all reviews for the current authenticated user
export async function GET() {
  try {
    await connectMongoDB();

    const reviews = await Review.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error in reviews GET:", error);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}


// POST: Create a new review for the authenticated user
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const data = await req.json();
    const { rating, text } = data;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Invalid rating value" }, { status: 400 });
    }

    if (text && typeof text !== "string") {
      return NextResponse.json({ message: "Invalid text format" }, { status: 400 });
    }

    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newReview = new Review({
      user: user._id,
      rating,
      text,
    });

    await newReview.save();
    await newReview.populate("user", "name"); // So the response includes the name

    return NextResponse.json({
      message: "Review submitted successfully",
      review: newReview.toJSON(),
    });
  } catch (error) {
    console.error("Error in reviews POST:", error);
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
  }
}
