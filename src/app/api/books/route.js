import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
	try {
		// Fetch books from Supabase
        const { data: books, error } = await supabase.from("books").select("*");
		if (error) {
			return NextResponse.json({ message: error }, { status: 500 });
		}
		return NextResponse.json({ data: books }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
