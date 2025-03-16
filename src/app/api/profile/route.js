import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
  try {
      const { searchParams } = new URL(req.url);
      const username = searchParams.get("username");
      const email = searchParams.get("email");
      const id = searchParams.get("id");
      const basicProfileOnly = searchParams.get("basic") === "true";  // New parameter to request only basic profile data

      if (!username && !email && !id) {
          return NextResponse.json({ error: "Username, email, or id is required" }, { status: 400 });
      }

      // Build query based on provided parameters and whether we need basic or full profile
      let selectQuery = `id, name, image, email, bio, username`;
      
      // Only include bookmarks if we're fetching the full profile
      if (!basicProfileOnly) {
          selectQuery += `, bookmarks:bookmarks(id, is_public, poem_id, stanza_id, created_at)`;
      }
      
      let query = supabase
          .from("users")
          .select(selectQuery);
      
      // Apply filter based on which parameter is provided
      if (id) {
          query = query.eq("id", id);
      } else if (email) {
          query = query.eq("email", email);
      } else {
          query = query.eq("username", username);
      }
      
      // Execute the query
      const { data: userData, error: userError } = await query.single();

      if (userError || !userData) {
          return NextResponse.json({ error: userError?.message || "User not found" }, { status: 404 });
      }

      // If only basic profile was requested, return it immediately
      if (basicProfileOnly) {
          return NextResponse.json(userData);
      }

      // Otherwise, continue with the full profile data processing
      // Destructure userData object:
      const { bookmarks = [], ...user } = userData;

      if (!bookmarks.length) {
          return NextResponse.json({ ...user, bookmarks: [] });
      }

      // Extract Unique Poem & Stanza IDs
      const poemIds = new Set();
      const stanzaIds = new Set();

      bookmarks.forEach(({ poem_id, stanza_id }) => {
          if (poem_id) poemIds.add(poem_id);
          if (stanza_id) stanzaIds.add(stanza_id);
      });

      // Fetch Poems & Stanzas in parallel
      const [poemsResult, stanzasResult] = await Promise.all([
          poemIds.size
              ? supabase.from("poem_details").select("id, title_ur, title_en, book_id").in("id", [...poemIds])
              : { data: [], error: null },
          stanzaIds.size
              ? supabase.from("stanzas").select("id, content_ur, poem_id, stanza_order").in("id", [...stanzaIds])
              : { data: [], error: null },
      ]);

      if (poemsResult.error || stanzasResult.error) {
          return NextResponse.json({ error: poemsResult.error?.message || stanzasResult.error?.message }, { status: 500 });
      }

      // Convert Poems & Stanzas to Maps for Fast Lookup
      const poemsMap = new Map(poemsResult.data.map(poem => [poem.id, poem]));
      const stanzasMap = new Map(stanzasResult.data.map(stanza => [stanza.id, stanza]));

      // Extract Unique Book IDs
      const bookIds = new Set(poemsResult.data.map(p => p.book_id).filter(Boolean));

      // Fetch Books (Only If Needed)
      let booksMap = new Map(), booksMapEn = new Map();
      if (bookIds.size) {
          const { data: books, error: booksError } = await supabase
              .from("books")
              .select("id, title_ur, title_en")
              .in("id", [...bookIds]);

          if (booksError) return NextResponse.json({ error: booksError.message }, { status: 500 });

          booksMap = new Map(books.map(book => [book.id, book.title_ur]));
          booksMapEn = new Map(books.map(book => [book.id, book.title_en]));
      }

      // Transform Bookmarks for Response
      const transformedBookmarks = bookmarks.map(({ id, is_public, poem_id, stanza_id, created_at }) => {
          const poem = poemsMap.get(poem_id);
          const stanza = stanzasMap.get(stanza_id);
          return {
              id,
              is_public: is_public || false,
              type: poem_id && !stanza_id ? "poem" : "stanza",
              poem_id,
              stanza_id,
              created_at,
              poem_title: poem?.title_ur || null,
              poem_title_en: poem?.title_en || null,
              book_title: poem?.book_id ? booksMap.get(poem.book_id) || null : null,
              book_title_en: poem?.book_id ? booksMapEn.get(poem.book_id) || null : null,
              stanza_content: stanza?.content_ur || null,
              stanza_order: stanza?.stanza_order || null,
          };
      });

      return NextResponse.json({ ...user, bookmarks: transformedBookmarks });

  } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId");
    const name = formData.get("name");
    const bio = formData.get("bio");
    let username = formData.get("username");
    const imageFile = formData.get("imageFile");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Ensure username doesn't have spaces
    if (username && /\s/.test(username)) {
      return NextResponse.json(
        { error: "Username cannot contain spaces" },
        { status: 400 }
      );
    }

    // Check if the username (case-insensitive) already exists for another user
    if (username) {
      const { data: existingUsers, error: checkError, count } = await supabase
        .from("users")
        .select("id", { count: 'exact' })
        .ilike("username", username)
        .neq("id", userId); // Exclude current user

      if (checkError) {
        throw checkError;
      }

      if (count > 0) {
        return NextResponse.json(
          { error: "This username is already taken" },
          { status: 400 }
        );
      }
    }

    // Update profile information including username
    const { error: updateError } = await supabase
      .from("users")
      .update({ name, bio, username })
      .eq("id", userId);

    if (updateError) throw updateError;

    let imageUrl = null;

    // Handle image upload if file exists
    if (imageFile && imageFile.size > 0) {
      // Get current user data to check existing image
      const { data: userData } = await supabase
        .from("users")
        .select("image, email")
        .eq("id", userId)
        .single();

      // Upload new image
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${
        userData?.email?.split("@")[0] || "user"
      }-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } =  supabase.storage
        .from("profile_images")
        .getPublicUrl(uploadData.path);

      imageUrl = publicUrlData.publicUrl;

      // Delete old image if exists
      if (userData?.image) {
        const oldImagePath = userData.image.split("/").pop();
        if (oldImagePath) {
          await supabase.storage
            .from("profile_images")
            .remove([oldImagePath]);
        }
      }

      // Update user with new image URL
      const { error: imageUpdateError } = await supabase
        .from("users")
        .update({ image: imageUrl })
        .eq("id", userId);

      if (imageUpdateError) throw imageUpdateError;
    }

    // Get updated user data
    const { data: updatedUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}



