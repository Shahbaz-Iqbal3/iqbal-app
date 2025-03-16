import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const poem_id = searchParams.get("poem_id");
		const stanza_id = searchParams.get("stanza_id");
		const parent_id = searchParams.get("parent_id");

		let query = supabase
			.from("comments")
			.select("*, user:users(id, name,image),replies_count:comments!parent_id(count)")
			.order("created_at", { ascending: false });

		if (poem_id) query = query.eq("poem_id", poem_id);
		query = stanza_id ? query.eq("stanza_id", stanza_id) : query.is("stanza_id", null);
		query = parent_id ? query.eq("parent_id", parent_id) : query.is("parent_id", null);

		const { data, error } = await query;

		if (error) throw error;
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: error.message || "Failed to fetch comments" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	

	try {
		const body = await request.json();
		const { content, poem_id, stanza_id, parent_id, user_id } = body;

		// Validate UUIDs
		const isValidUUID = (id) =>
			id === null ||
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

		if (!isValidUUID(poem_id)) throw new Error("Invalid poem ID");
		if (stanza_id && !isValidUUID(stanza_id)) {
			throw new Error("Invalid stanza ID");
		}
    if(parent_id && !isValidUUID(parent_id)) {
      throw new Error("Invalid parent ID")
    }
		
		const { data, error } = await supabase
			.from("comments")
			.insert({
				content,
				poem_id: poem_id || null,
				stanza_id: stanza_id || null,
				parent_id: parent_id || null,
				user_id: user_id || null,
			})
			.select("*, user:users(id, name, image),replies_count:comments!parent_id(count)");

		if (error) throw error;
		return NextResponse.json(data[0], { status: 201 });
	} catch (error) {
		console.log("Error creating comment:", error);

		return NextResponse.json(
			{ error: error.message || "Failed to create comment" },
			{ status: 500 }
		);
	}
}
// delete comment
// API route fix
export async function DELETE(request) {
	try {
	  const { searchParams } = new URL(request.url);
	  const id = searchParams.get("id");
  
	  // Validate ID exists
	  if (!id) {
		return NextResponse.json(
		  { error: "Missing comment ID" },
		  { status: 400 }
		);
	  }
  
	  const { error } = await supabase.from("comments").delete().eq("id", id);
  
	  
	  if (error) throw error;
	  
	  return NextResponse.json({ message: "Comment deleted" });
	} catch (error) {
		console.log("Error deleting comment:", error);
		
	  return NextResponse.json(
		{ error: error.message || "Failed to delete comment" },
		{ status: 500 }
	  );
	}
  }