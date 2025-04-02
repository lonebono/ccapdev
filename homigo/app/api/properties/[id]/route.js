import { connectMongoDB } from "@/lib/mongodb";
import Property from "@/models/property";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    
    const { id } = await params;
    const propertyId = id;
    
    if (!propertyId) {
      return NextResponse.json({ message: "Property ID is required" }, { status: 400 });
    }
    
    const property = await Property.findById(propertyId)
      .populate("lister", "name email");
    
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      property: {
        propertytitle: property.title,
        price: property.pricepernight,
        location: property.location,
        description: property.description,
        image: property.image,
        cleaningFee: 2500, // Default value since schema doesn't have it
        serviceFee: 500, // Default value since schema doesn't have it
      }
    });
    
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { message: "Error fetching property details", error: error.message }, 
      { status: 500 }
    );
  }
}
