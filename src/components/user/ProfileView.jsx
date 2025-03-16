import ProfileImage from "./ProfileImage";
import { motion } from "framer-motion";
import { preserveLineBreaks } from "@/utils/formatText";


const ProfileView = ({ userData, onEdit, isOwnProfile }) => (
	<div className="flex flex-col md:flex-row items-center sm:gap-8 gap-4">
		<motion.div
			className="flex-1 flex flex-row sm:flex-col "
			initial={{ x: 20, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{" "}
			<div className="flex sm:flex-row flex-col gap-4 sm:gap-8 justify-center flex-grow">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<ProfileImage image={userData?.image} />
				</motion.div>
				<div className="flex justify-between flex-col sm:-mt-0 -mt-24 flex-1">
					<div className="flex flex-col sm:flex-row items-start  gap-2 justify-between sm:items-center ml-24 sm:ml-0">
						<div>
							<h2 className="text-gray-700 sm:text-2xl text-xl sm:font-semibold dark:text-white">
								{userData?.name || "User"}
							</h2>
							<p className="text-gray-600 dark:text-gray-400 my-1">{userData?.email}</p>
						</div>
						{isOwnProfile && (
							<button
								onClick={onEdit}
								className="px-4 py-2 font-[600] text-sm bg-secondary dark:bg-secondary-dark dark:text-white text-gray-700 rounded-lg hover:bg-hover	 dark:hover:bg-hover-dark transition-colors"
							>
								Edit Profile
							</button>
						)}
					</div>
					<p className="text-gray-700 dark:text-gray-300 mt-8 max-w-2xl whitespace-pre-wrap text-sm sm:text-base">
						{preserveLineBreaks(userData?.bio || "No bio available")}
					</p>
				</div>
			</div>
		</motion.div>
	</div>
);

export default ProfileView;