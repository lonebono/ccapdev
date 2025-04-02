import { connectMongoDB } from "@/lib/mongodb";
import Booking from "@/models/booking";
import User from "@/models/user";
import Property from "@/models/property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    
    await connectMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Get all bookings for the current user
    const bookings = await Booking.find({ userId: user._id })
      .populate('propertyId', 'propertytitle location image price description') // Updated field names
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ bookings });
    
  } catch (error) {
    console.error("Error in bookings GET:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings" }, 
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    
    await connectMongoDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const data = await req.json();
    const { 
      startDate, 
      endDate, 
      guestCount, 
      propertyId, 
      paymentMethod,
      totalPrice 
    } = data;
    
    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    
    // Check for date availability (prevent double bookings)
    const overlappingBookings = await Booking.find({
      propertyId,
      $or: [
        { 
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ],
      status: { $ne: 'cancelled' }
    });
    
    if (overlappingBookings.length > 0) {
      return NextResponse.json({ 
        message: "Selected dates are not available for this property" 
      }, { status: 400 });
    }
    
    // Create new booking
    const newBooking = new Booking({
      userId: user._id,
      propertyId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guestCount,
      paymentMethod,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date()
    });
    
    await newBooking.save();
    
    // Add dates to property's unavailable dates - NEW CODE
    const dateArray = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Update property with new unavailable dates
    await Property.findByIdAndUpdate(
      propertyId,
      { $push: { unavailableDates: { $each: dateArray } } }
    );
    
    return NextResponse.json({
      message: "Booking created successfully",
      booking: newBooking
    });
    
  } catch (error) {
    console.error("Error in bookings POST:", error);
    return NextResponse.json(
      { message: "Failed to create booking" }, 
      { status: 500 }
    );
  }
}