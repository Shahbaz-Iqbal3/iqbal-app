import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const bookId = searchParams.get("book_id");

		// Fetch book id from Supabase
		const { data: book, error: bookError } = await supabase
			.from("books")
			.select("*")
			.eq("title_en", bookId)
			.single();

		if (bookError || !book) {
			return NextResponse.json({ error: "Book not found" }, { status: 404 });
		}

		const { data: book_contents, error } = await supabase
			.from("book_contents")
			.select("*")
			.eq("book_id", book.id);
		if (error) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
		return NextResponse.json({ book, data: book_contents }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
