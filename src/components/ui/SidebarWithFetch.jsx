"use client";
import { useEffect, useState } from "react";
import Sidebar, { SidebarSkeleton } from "./Sidebar";

export default function SidebarWithFetch({ bookId, slug }) {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoems() {
      setLoading(true);
      try {
        const res = await fetch(`/api/books/listofpoem?book_id=${bookId}&title_only=true`);
        const data = await res.json();
        setPoems(data.data || []);
      } catch {
        setPoems([]);
      }
      setLoading(false);
    }
    fetchPoems();
  }, [bookId]);

  if (loading) return <SidebarSkeleton />;
  return <Sidebar bookId={bookId} poems={poems} slug={slug} isOpen={true} />;
} 