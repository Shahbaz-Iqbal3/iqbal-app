import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        const { searchParams } = new URL(req.url);
        const poemName = searchParams.get("poem_id");

        // Validate required parameter
        if (!poemName) {
            return NextResponse.json(
                { error: "Poem ID is required" },
                { status: 400 }
            );
        }

        // Normalize poem name
        const poem_name = poemName.replace(/-/g, " ").toUpperCase();

        // Main poem query
        let query = supabase
            .from("poem_details")
            .select(`
                title_en, title_ur, audio_url, poem_order, id,
                stanzas(id, stanza_order, content_en, content_ur, content_ro)
                ${userId ? ", bookmarks!left(user_id, poem_id, stanza_id, created_at)" : ""}
            `)
            .eq("title_en", poem_name)
            .single();

        // Add user filter if logged in
        if (userId) {
            query = query.eq("bookmarks.user_id", userId);
        }

        // Execute query
        const { data: poemData, error: poemError } = await query;

        // Handle query errors
        if (poemError || !poemData) {
            console.error("Database error:", poemError);
            return NextResponse.json(
                { error: "Poem not found" },
                { status: 404 }
            );
        }

        const poemOrder = poemData.poem_order;

        // Fetch previous and next poems based on order
        const { data: adjacentPoems, error: adjacentError } = await supabase
            .from("poem_details")
            .select("poem_order, title_en, title_ur")
            .in("poem_order", [poemOrder - 1, poemOrder + 1]);

        if (adjacentError) {
            console.warn("Adjacent poem fetch error:", adjacentError);
        }

        const navigation = {
            previous: null,
            next: null,
        };

        for (const poem of adjacentPoems || []) {
            if (poem.poem_order === poemOrder - 1) {
                navigation.previous = {
                    title_en: poem.title_en,
                    title_ur: poem.title_ur
                };
            } else if (poem.poem_order === poemOrder + 1) {
                navigation.next = {
                    title_en: poem.title_en,
                    title_ur: poem.title_ur
                };
            }
        }

        // Process bookmarks
        const processedData = {
            ...poemData,
            bookmark: userId ? poemData?.bookmarks || null : null,
            navigation
        };

        // Remove bookmarks array from final response
        const { bookmarks, ...cleanData } = processedData;

        return NextResponse.json(cleanData);

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}