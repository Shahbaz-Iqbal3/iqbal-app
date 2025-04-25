import Link from "next/link";

const BooksNavigation = ({ currentBookId }) => {
	const books = [
		{
			title_en: "Bang-e-Dra",
			title_ur: "بانگ درا",
		},
		{
			title_en: "Bal-e-Jibril",
			title_ur: "بال جبریل",
		},
		{
			title_en: "Zarb-e-Kaleem",
			title_ur: "ضرب کلیم",
		},
		{
			title_en: "Armaghan-e-Hijaz(Urdu)",
			title_ur: "ارمغان حجاز (اردو)",
		},
		{
			title_en: "Armaghan-e-Hijaz(Farsi)",
			title_ur: "ارمغان حجاز (فارسی)",
		},
		{
			title_en: "Rumuz-e-Bekhudi",
			title_ur: "رموزِ بیخودی",
		},
		{
			title_en: "Payam-e-Mashriq",
			title_ur: "پیامِ مشرق",
		},
		{
			title_en: "Zabur-e-Ajam",
			title_ur: "زبورِعجم",
		},
		{
			title_en: "Javed-Nama",
			title_ur: "جاوید نامہ",
		},
		{
			title_en: "Pas-Cheh-Bayad-Kard",
			title_ur: "پس چہ بائد کرد",
		},
		{
			title_en: "Asrar-e-Khudi",
			title_ur: "اسرارِ خودی",
		}
	];

	return (
		<div className="w-full bg-primary dark:bg-primary-dark py-6 px-4 sm:px-6 ">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
					Explore All Books
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
					{books.map((book) => (
						<Link
							key={book.title_en}
							href={`/books/${book.title_en.replace(/ /g, "-")}`}
							className={`group relative overflow-hidden p-3 sm:p-4 rounded-lg transition-all duration-300 ${
								currentBookId === book.title_en.toLowerCase().replace(/ /g, "-")
									? "bg-blue-900 dark:bg-blue-800 text-white shadow-lg shadow-blue-900/20"
									: "bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:shadow-blue-900/10"
							}`}
						>
							<div className="flex flex-col items-center text-center">
								<h3 className="text-sm sm:text-base font-medium mb-1 font-nastaliq" dir="rtl">
									{book.title_ur}
								</h3>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
									{book.title_en}
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default BooksNavigation; 