import { supabase } from "@/lib/supabase";

export async function toggleBookmark({ userId, poemId, stanzaId = null }) {
	// Check if the bookmark exists
	let query = supabase
		.from("bookmarks")
		.select("*")
		.eq("user_id", userId)
		.eq("poem_id", poemId);

	if (stanzaId === null) {
		query = query.is("stanza_id", null);
	} else {
		query = query.eq("stanza_id", stanzaId);
	}

	const { data, error } = await query;
	if (error) {
		console.error("Error fetching bookmark:", error);
		return { error };
	}

	if (data && data.length > 0) {
		// Bookmark exists; remove it.
    
		let deleteQuery = supabase
			.from("bookmarks")
			.delete()
			.eq("user_id", userId)
			.eq("poem_id", poemId);

		if (stanzaId === null) {
			deleteQuery = deleteQuery.is("stanza_id", null);
		} else {
			deleteQuery = deleteQuery.eq("stanza_id", stanzaId);
		}

		const { error: deleteError } = await deleteQuery;
		if (deleteError) {
			console.error("Error deleting bookmark:", deleteError);
			return { error: deleteError };
		}
		return { message: "Bookmark removed." };
	} else {
		// Bookmark does not exist; add it.
		const { data: insertData, error: insertError } = await supabase
			.from("bookmarks")
			.insert([{ user_id: userId, poem_id: poemId, stanza_id: stanzaId }]);
		if (insertError) {
			console.error("Error inserting bookmark:", insertError);
			return { error: insertError };
		}
		return { message: "Bookmark added.", data: insertData };
	}
}
