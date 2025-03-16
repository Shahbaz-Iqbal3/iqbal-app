import { supabase } from "@/lib/supabase";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async signIn({ user }) {
			const { name, email, image } = user;

			// Check if the user already exists
			const { data: existingUser, error } = await supabase
				.from("users")
				.select("id, image")
				.eq("email", email)
				.single();

			let newImageUrl = image; // Default to Google image

			// Insert or update user in Supabase
			if (!existingUser) {
				if (image) {
					try {
						// Download image from Google
						const response = await fetch(image);
						const imageBuffer = await response.arrayBuffer();
						const urlParts = image.split("?");
						const fileExtMatch = urlParts[0].match(/\.([a-zA-Z0-9]+)$/);
						const fileExt = fileExtMatch ? fileExtMatch[1] : "jpg"; // Extract extension

						// Generate clean file name (avoid directories)
						const fileName = `${email.split("@")[0]}-${Date.now()}.${fileExt}`;

						// Delete old image if user exists
						if (existingUser?.image) {
							const oldImagePath = existingUser.image.split("/").pop();
							await supabase.storage.from("profile_images").remove([oldImagePath]);
						}

						// Upload new image to Supabase
						const { error: uploadError } = await supabase.storage
							.from("profile_images")
							.upload(fileName, imageBuffer, { contentType: `image/${fileExt}` });

						if (!uploadError) {
							// Get the new public URL
							const { data: publicURL } = supabase.storage
								.from("profile_images")
								.getPublicUrl(fileName);
							newImageUrl = publicURL.publicUrl; // Use Supabase image URL
						}
					} catch (err) {
						console.error("Error uploading Google image to Supabase:", err);
					}
				}
				const { error: insertError } = await supabase.from("users").insert([
					{
						name,
						email,
						image: newImageUrl, // Store new image URL
						username: null, // Explicitly set username to null for new users
					},
				]);

				if (insertError) {
					console.error("Error inserting user:", insertError);
					return false;
				}
			}

			return true;
		},
		async session({ session, token }) {
			// Fetch the updated user image from Supabase
			const { data: userData } = await supabase
				.from("users")
				.select("image, id, username")
				.eq("email", session.user.email)
				.single();

			if (userData?.image) {
				session.user.image = userData.image; // Override Google image with Supabase image
			}
			if (session?.user) {
				session.user.id = userData.id; // Add user ID from token to session
				session.user.username = userData.username;
			}
			return session;
		},
	},
};
