"use client";
import Link from "next/link";
import { LogOut, Home, Info, Phone, Book, SquareUser, Bookmark } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeProvider";
import NavbarSearch from "@/components/ui/NavbarSearch";


const Navbar = () => {
	const { data: session, status } = useSession(); // status: "loading" | "authenticated" | "unauthenticated"
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<nav className="bg-white dark:bg-secondary-dark dark:text-white text-gray-700 shadow-sm py-4 px-2">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-lg font-semibold">
					<Link href="/" className="hover:text-gray-500 dark:text-gray-200 transition duration-300">
						Allama Iqbal
					</Link>
				</div>
				
				{/* Center area with search on desktop, hidden on mobile */}
				<div className="hidden md:block max-w-[450px]  mx-4">
					<NavbarSearch />
				</div>
				
				<div className="flex items-center space-x-4">
					{/* Mobile search icon, hidden on desktop */}
					<div className="md:hidden">
						<NavbarSearch />
					</div>
					
					<div className="flex items-center">
						<ThemeToggle className="text-gray-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500" />
					</div>

					{status === "loading" ? (
						// Loading spinner
						<div className="flex items-center justify-center">
							<div className="w-6 h-6 border-2 border-gray-200 border-t-white rounded-full animate-spin"></div>
						</div>
					) : session ? (
						// User info dropdown
						<div className="relative" ref={dropdownRef}>
							<div className="rounded-full  bg-slate-200 dark:bg-gray-600 p-1 cursor-pointer group">
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className="flex items-center space-x-2"
								>
									<div className="w-8 h-8 rounded-full overflow-hidden bg-white">
										<Image
											src={session.user.image ?? "/user.svg"}
											alt={session.user.name ?? "User avatar"}
											className="w-full h-full object-cover"
											width={32}
											height={32}
										/>
									</div>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5 group-hover:translate-y-[2px] transition-transform duration-300">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
    
								</button>
								
							</div>

							{dropdownOpen && (
								<div className="absolute right-0 top-9 mt-2 z-[100] md:w-[300px] bg-primary dark:bg-gray-600 dark:text-white text-gray-700 shadow-lg rounded-lg py-2">
									<div className="px-4 py-2 flex gap-3 justify-start items-center w-full">
										<div className="w-10 h-10 rounded-full overflow-hidden bg-white">
											<Image
												src={session.user.image ?? "/user.svg"}
												alt={session.user.name ?? "User avatar"}
												className="w-full h-full object-cover"
												width={32}
												height={32}
											/>
										</div>
										<div className="dark:text-white leading-4 w-fit">
											<p className="">{session.user.name}</p>
											<p className="text-sm">{session.user.email}</p>
										</div>
									</div>
									<div className="w-full h-[1px] bg-gray-200 dark:bg-gray-500"></div>
									<Link 
										href={`/user/${session.user.username}` || "/"}
										className="w-full text-left px-4 py-2 flex gap-4 items-center hover:bg-slate-50 dark:hover:bg-gray-700"
										onClick={() => setDropdownOpen(false)}
									>
										<SquareUser /> <span>My Profile</span>
									</Link>
									<button
										onClick={() => redirect(`${`/user/${session.user.username}#bookmarks` || "/" }`)}
										className="w-full text-left px-4 py-2 flex gap-4 items-center hover:bg-slate-50 dark:hover:bg-gray-700"
									>
										<Bookmark /> <span>Bookmarks</span>
									</button>
									<button
										onClick={() => signOut()}
										className="w-full text-left px-4 py-2 flex gap-4 items-center hover:bg-slate-50 dark:hover:bg-gray-700"
									>
										<LogOut /> <span>Sign Out</span>
									</button>
								</div>
							)}
						</div>
					) : (
						// Sign-in button
						<button
							onClick={() => redirect("/auth/login")}
							className="px-4 py-1 text-sm bg-green-700 dark:bg-[#006239] text-gray-50 rounded-md cursor-pointer hover:bg-opacity-90   
							border-[1px] border-green-600 hover:border-green-500 transition-colors"
						>
							Sign In
						</button>
					)}

					
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
