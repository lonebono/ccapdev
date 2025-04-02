import { getServerSession } from "next-auth/next";
import { compare, hash } from "bcrypt";
import User from "../../../models/user";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { currentPassword, newPassword } = await req.json();
    
    // Get user from database
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify current password
    const passwordMatch = await compare(currentPassword, user.password);
    
    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: 'Current password is incorrect' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);
    
    // Update user password
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Password update error:', error);
    return new Response(JSON.stringify({ message: 'Failed to update password' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}