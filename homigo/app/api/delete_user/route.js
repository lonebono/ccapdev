import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/user";
import Property from "@/models/property";
import Booking from "@/models/booking";
import mongoose from "mongoose";

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const sessionUserId = session.user.id;

  try {
    // Start a transaction for atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete all bookings by this user
      await Booking.deleteMany({ userId: sessionUserId }).session(session);
      
      //Delete all properties listed by this user
      await Property.deleteMany({ lister: sessionUserId }).session(session);
      
      //Delete the user
      const deletedUser = await User.findByIdAndDelete(sessionUserId).session(session);
      
      if (!deletedUser) {
        throw new Error("User not found");
      }

      await session.commitTransaction();
      
      return NextResponse.json(
        { success: true, message: "User and all related data deleted" },
        { status: 200 }
      );

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}