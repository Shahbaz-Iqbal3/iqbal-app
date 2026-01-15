// src/components/tiptap-node/stanza-node/stanza-node-view.jsx
"use client";

import React, { useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Search, Loader2 } from "lucide-react";


export default function StanzaNodeView({ node, editor, updateAttributes }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const isEmpty = !node.textContent || node.textContent.trim().length === 0;
  const { id } = node.attrs;

  // Simple search (replace with real API)
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&contentType=stanza&limit=5`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Insert/replace stanza content with the selected text
  const handleSelect = async (selectedText) => {
    if (!selectedText) return;

    // Try the extension command first (clean & intended way)
    try {
      const ok = editor?.commands?.setStanzaContent?.(id, selectedText);
      if (ok) {
        // command executed and dispatched — close dialog & refocus editor
        setOpen(false);
        // small timeout to let dialog close before focusing editor
        setTimeout(() => editor.chain().focus().run(), 20);
        return;
      }
    } catch (err) {
      console.warn("setStanzaContent command failed:", err);
    }

    // Fallback: run a transaction directly (safe fallback)
    try {
      editor
        .chain()
        .focus()
        .command(({ tr, state, dispatch }) => {
          let found = false;
          state.doc.descendants((child, pos) => {
            if (child.type.name === "stanza" && child.attrs.id === id) {
              found = true;
              const from = pos + 1; // children start
              const to = pos + child.nodeSize - 1; // children end
              tr = tr.delete(from, to);
              const paragraph = state.schema.nodes.paragraph.create(
                {},
                state.schema.text(selectedText)
              );
              tr = tr.insert(from, paragraph);
            }
          });
          if (found && dispatch) {
            dispatch(tr.scrollIntoView());
            return true;
          }
          return false;
        })
        .run();

      setOpen(false);
      setTimeout(() => editor.chain().focus().run(), 20);
    } catch (err) {
      console.error("Fallback transaction failed:", err);
    }
  };

  // Stop propagation on result / button clicks to avoid strange editor focus/selection issues
  const onResultClick = (e, r) => {
    e.stopPropagation();
    handleSelect(r);
  };

  return (
    <NodeViewWrapper
      className="relative group p-4 border-gray-600 border rounded-md shadow-sm"
      data-type="stanza"
    >
      {/* Editable stanza content */}
      <div className="relative w-full">
        {isEmpty && (
          <span className="absolute inset-0 flex items-center justify-center text-gray-400 italic pointer-events-none">
            Search or write a stanza…
          </span>
        )}
        <NodeViewContent className="outline-none w-full font-nastaliq text-center text-xl leading-relaxed" />
      </div>

      {/* Hover search button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Search stanza"
      >
        <Search className="w-5 h-5 text-gray-100 hover:text-gray-300" />
      </button>

      {/* Overlay search dialog */}
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          // clicking backdrop closes dialog
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="bg-primary-dark p-6 rounded-2xl shadow-lg w-[500px] max-w-full"
            onMouseDown={(e) => e.stopPropagation()} // prevent backdrop handler
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-4 text-white">Search Stanza</h2>
              {loading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Searching stanzas...</span>
                </div>
              )}
            </div>

            {/* Search bar */}
            <div className="flex gap-2 mb-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search…"
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none text-primary-dark font-poppins"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSearch();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Search
              </button>
            </div>

            {/* Results list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.map(r => (
                <div key={r.id} dir="rtl" className="p-4 border-b border-gray-500 cursor-pointer hover:bg-gray-700 text-white font-nastaliq flex "
                  onClick={(e) => onResultClick(e, r.content_ur.replace("|", "\n"))}>
                  <div className="flex justify-center gap-6 items-start flex-col w-1/3 border-l border-gray-600 overflow-hidden ">
                    <div className="text-xs text-nowrap ">{r.title_ur || "Untitled"}</div>
                    <div className="text-xs">{r.book_name_ur}</div>

                  </div>
                  <div className="text-lg whitespace-pre-line text-center tracking-widest w-2/3">{r.content_ur.replace("|", "\n")}</div>
                </div>
              ))}

              {results.length === 0 && (
                <p className="text-sm text-gray-500">No results yet.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="px-4 py-2 rounded hover:bg-gray-700 border border-gray-600 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
}
