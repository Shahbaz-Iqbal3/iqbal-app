import React from "react";
import { Download } from "lucide-react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

const ShareButtons = ({ handleShare, handleDownload }) => {
	return (
		<div className="flex justify-center space-x-2 sm:space-x-4">
			<button
				onClick={() => handleShare("twitter")}
				className="p-2 sm:p-3 bg-blue-400 hover:bg-blue-500 text-white rounded-full"
				title="Share on Twitter"
			>
				<FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>
			<button
				onClick={() => handleShare("facebook")}
				className="p-2 sm:p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
				title="Share on Facebook"
			>
				<FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>
			<button
				onClick={() => handleShare("whatsapp")}
				className="p-2 sm:p-3 bg-green-500 hover:bg-green-600 text-white rounded-full"
				title="Share on WhatsApp"
			>
				<FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>
			<button
				onClick={handleDownload}
				className="p-2 sm:p-3 bg-gray-700 hover:bg-gray-800 text-white rounded-full"
				title="Download Image"
			>
				<Download className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>
		</div>
	);
};

export default ShareButtons; 