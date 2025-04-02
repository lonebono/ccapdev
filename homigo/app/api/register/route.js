// Import Necessary Modules/Components
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

//export makes it so that the function/etc can be imported into other files
//async is used to make an asynchronous function, allows the use of await to hanfle queries and api calls
//POST function handles HTTP POST requests to this API route, basically it processes user registration data.
export async function POST(req) {
    try {
        const { name, email, password } = await req.json(); //req is the request object, req.json() returns something/returns whatever specified that resolves with the JSON object

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 } // Bad Request ; These status codes are pretty useful imo
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        await connectMongoDB();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already in use." },
                { status: 409 } // Conflict
            );
        }

        const existingName = await User.findOne({ 
            name: { $regex: `^${name}$`, $options: 'i' } 
        });
        
        if (existingName) {
            return NextResponse.json(
                { message: "Name already taken." },
                { status: 409 } // Conflict
            );
        }


        // Create new user
        await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            city: "",
            preferredNickname: "",
            bio: "",
            profilePic: ""
        });

        return NextResponse.json(
            { message: "User registered successfully." },
            { status: 201 } // Created
        );
    } catch (error) {
        console.error("Error during registration:", error);

        if (error.name === "ValidationError") {
            return NextResponse.json(
                { message: "Invalid email format. Please enter a valid email address." },
                { status: 400 } // Bad Request
            );
        }

        return NextResponse.json(
            { message: "An error occurred while registering the user." },
            { status: 500 } // Internal Server Error
        );
    }
}