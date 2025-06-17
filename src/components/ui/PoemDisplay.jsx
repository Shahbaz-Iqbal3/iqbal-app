import BookmarkButton from "./BookmarkButton";
import CommentsPopup from "./CommentButton";
import CopyButton from "./CopyPoemButton";
import ShareButton from "./ShareButton";
import ShareVerseButton from "./ShareVerseButton";

export default function PoemDisplay({ stanza, poemId, bookmarks, userId, bookId, poemName , poemNameUr }) {
	const ur = stanza.content_ur;
	const en = stanza.content_en || "";
	const ro = stanza.content_ro || "";

	const Urdu = ur.split("|");
	const English = en ? en.split("|") : [];
	const Romanian = ro ? ro.split("|") : [];

	const initialBookmarked = bookmarks?.some((b) => b.stanza_id === stanza.id);

	return (
		<div className="sm:py-12 py-8 border-b border-gray-200 dark:border-gray-700 flex sm:flex-row-reverse flex-col items-center transition-colors duration-300">
			<div className="w-[calc(100%-10px)] px-3 overflow-auto">
				<div className="flex flex-col">
					{Urdu.map((line, index) => (
						<p
							key={index}
							className="sm:text-3xl text-xl text-gray-900 dark:text-white text-right font-nastaliq my-1 sm:mb-8 mb-3 w-full"
						>
							{line}
						</p>
					))}
				</div>
				{English.length > 0 && (
					<div className="flex flex-col mb-2">
						{English.map((line, index) => (
							<p
								key={index}
								className="sm:text-lg text-sm text-gray-700 dark:text-gray-200 mt-2"
							>
								{line}
							</p>
						))}
					</div>
				)}
				{Romanian.length > 0 && (
					<div>
						{Romanian.map((line, index) => (
							<p
								key={index}
								className="sm:text-base text-xs text-gray-600 dark:text-gray-400 italic"
							>
								{line}
							</p>
						))}
					</div>
				)}
			</div>

			<div className="mt-3 flex sm:flex-col items-center justify-start gap-5 sm:w-1/12 text-gray-500 dark:text-gray-400">
				<BookmarkButton
					userId={userId}
					poemId={poemId}
					stanzaId={stanza.id}
					initialBookmarked={initialBookmarked}
					isLogin={!userId}
				/>
				<CopyButton content={stanza} />
				<ShareButton
					book={bookId}
					poem={poemName}
					stanzaId={stanza.stanza_order}
					shareText={Urdu.join("\n")}
				/>
				<ShareVerseButton 
					verse={English.join("\n")} 
					author={poemName}
					urduVerse={Urdu.join("\n")}
					englishVerse={English.join("\n")}
					romanianVerse={Romanian.join("\n")}
					poemNameUr={poemNameUr}
					bookName={bookId}
				/>
				<CommentsPopup poemId={poemId} stanzaId={stanza.id} />
			</div>
		</div>
	);
}
