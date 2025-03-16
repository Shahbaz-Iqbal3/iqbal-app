import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Check for spaces in the username
    if (/\s/.test(username)) {
      return NextResponse.json(
        { available: false, error: "Username cannot contain spaces" },
        { status: 200 }
      );
    }

    // Check if the username already exists in the database (case-insensitive)
    const { data, error, count } = await supabase
      .from("users")
      .select("id, username", { count: 'exact' })
      .ilike("username", username);

    if (error) {
      console.error("Error checking username:", error);
      return NextResponse.json(
        { error: "Failed to check username availability" },
        { status: 500 }
      );
    }

    // Return whether the username is available (count === 0)
    return NextResponse.json({ 
      available: count === 0,
      message: count === 0 ? "Username is available" : "Username is already taken",
      existingUsernames: count > 0 ? data.map(user => user.username) : []
    });

  } catch (error) {
    console.error("Server error checking username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 