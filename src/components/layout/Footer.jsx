import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-secondary-dark dark:text-white text-gray-700 shadow-sm py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Allama Iqbal</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">We are dedicated to preserving and sharing the literary legacy of Allama Iqbal with the world.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">About Us</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Our mission is to make Iqbal's poetry accessible to everyone, promoting his philosophy of self-discovery and spiritual growth.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Quick Links</h3>
          <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
            <li><a href="/" className="hover:text-gray-900 dark:hover:text-white transition duration-200">Home</a></li>
            <li><a href="/books" className="hover:text-gray-900 dark:hover:text-white transition duration-200">Books</a></li>
            <li><a href="/about" className="hover:text-gray-900 dark:hover:text-white transition duration-200">About</a></li>
            <li><a href="/contact" className="hover:text-gray-900 dark:hover:text-white transition duration-200">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Follow Us</h3>
          <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition duration-200 flex items-center">
              <FaFacebook className="mr-1" /> Facebook
            </a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition duration-200 flex items-center">
              <FaTwitter className="mr-1" /> Twitter
            </a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition duration-200 flex items-center">
              <FaInstagram className="mr-1" /> Instagram
            </a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-8 border-t border-gray-300 dark:border-gray-700 pt-4 px-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} Allama Iqbal. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition duration-200">Privacy Policy</a>
          <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition duration-200">Terms of Service</a>
          <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition duration-200">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
