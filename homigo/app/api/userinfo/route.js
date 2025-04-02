import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" }, 
        { status: 401 }
      );
    }
    
    await connectMongoDB();
    
    const user = await User.findOne({ email: session.user.email })
      .select('-password -__v'); 
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      name: user.name,
      email: user.email,
      city: user.city || "",
      preferredNickname: user.preferredNickname || "",
      bio: user.bio || "",
      profilePic: user.profilePic,
      createdAt: user.createdAt
    });
    
  } catch (error) {
    console.error("Error in userinfo GET:", error);
    return NextResponse.json(
      { message: "Failed to fetch user information" }, 
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" }, 
        { status: 401 }
      );
    }
    
    const { name, email, city, preferredNickname, bio, image } = await req.json();
    
    await connectMongoDB();
    
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(city !== undefined && { city }),
      ...(preferredNickname !== undefined && { preferredNickname }),
      ...(bio !== undefined && { bio }),
      ...(image !== undefined && { profilePic: image })
    };
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true, select: '-password -__v' }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        city: updatedUser.city || "",
        preferredNickname: updatedUser.preferredNickname || "",
        bio: updatedUser.bio || "",
        profilePic: updatedUser.profilePic || ""
      }
    });
    
  } catch (error) {
    console.error("Error in userinfo POST:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile" }, 
      { status: 500 }
    );
  }
}
