"use client";
import React, { useState } from 'react';
import { Image } from 'lucide-react';
import ShareVerseModal from './ShareVerseModal';

export default function ShareVerseButton({ verse, author, urduVerse, englishVerse, poemNameUr, bookName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Share as Image"
      >
        <Image className="w-5 h-5" />
      </button>
      
      <ShareVerseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        verse={verse}
        author={author}
        urduVerse={urduVerse}
        englishVerse={englishVerse}
        poemNameUr={poemNameUr}
        bookName={bookName}
      />
    </>
  );
} 