import BookmarkButton from "./BookmarkButton";
import CommentsPopup from "./CommentButton";
import CopyButton from "./CopyPoemButton";
import ShareButton from "./ShareButton";


export default function PoemDisplay({ stanza, poemId, bookmarks, userId, bookId, poemName }) {
	const [ur, en, ro] = [stanza.content_ur, stanza.content_en, stanza.content_ro];
	const Urdu = ur.split("|");
	const English = en.split("|");
	const Romanian = ro.split("|");

	const initialBookmarked = bookmarks?.some((b) => b.stanza_id === stanza.id);

	return (
		<div className="sm:py-12 py-8 border-b border-gray-200 dark:border-gray-700 flex sm:flex-row-reverse flex-col items-center transition-colors duration-300">
			<div className="w-full px-3">
				<div className="flex flex-col">
					<p className="sm:text-3xl text-lg text-gray-900 dark:text-white text-right font-urdu my-1 sm:mb-8 mb-3 w-full">
						{Urdu[0]}
					</p>
					<p className="sm:text-3xl text-lg text-gray-900 dark:text-white text-right font-urdu my-1 sm:mb-8 mb-3 w-full">
						{Urdu[1]}
					</p>
				</div>
				<div className="flex flex-col mb-2">
					<p className="sm:text-lg text-sm text-gray-700 dark:text-gray-200 mt-2">{English[0]}</p>
					<p className="sm:text-lg text-sm text-gray-700 dark:text-gray-200">{English[1]}</p>
				</div>
				<div>
					<p className="sm:text-base text-xs text-gray-600 dark:text-gray-400 italic">{Romanian[0]}</p>
					<p className="sm:text-base text-xs text-gray-600 dark:text-gray-400 italic">{Romanian[1]}</p>
				</div>
			</div>

			<div className="mt-3 flex sm:flex-col items-center justify-start gap-5 sm:w-1/12 text-gray-500 dark:text-gray-400">
				<BookmarkButton
					userId={userId}
					poemId={poemId}
					stanzaId={stanza.id}
					initialBookmarked={initialBookmarked}
					isLogin={!userId ? true : false}
				/>
				<button
					className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
					onClick={() => {
						console.log(Romanian);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
						/>
					</svg>
				</button>
				<CopyButton content={stanza} />
				<ShareButton
					book={bookId}
					poem={poemName}
					stanzaId={stanza.stanza_order}
					shareText={ur
						.split("|")
						.map((part) => part.trim())
						.join("\n")}
				/>
				<CommentsPopup poemId={poemId} stanzaId={stanza.id} />
			</div>
		</div>
	);
}

