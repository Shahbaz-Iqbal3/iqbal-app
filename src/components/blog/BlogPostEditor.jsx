"use client";

import { useState, useRef, useEffect } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { SquareArrowOutUpRight } from "lucide-react";
import "./styles.css"


// Fixed gradient based on title hash for consistency
const GRADIENTS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3']
];
// Simple feature image generator with consistent colors
const generateFeatureImage = (title, gradientIndex, isRTL) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1200;
  canvas.height = 800;

  const [color1, color2] = GRADIENTS[gradientIndex];

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ---- TEXT ----
  ctx.fillStyle = '#ffffff';
  ctx.font = !isRTL ? 'bold 48px Poppins' : "bold 48px amiri";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const words = title.split(' ');
  const lines = [];
  let line = '';

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width < canvas.width - 80) {
      line = testLine;
    } else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);

  const lineHeight = 60;
  const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((l, i) => {
    ctx.fillText(l, canvas.width / 2, startY + i * lineHeight);
  });

  return canvas.toDataURL('image/jpeg', 0.8);
};


export default function BlogPostEditor({ initialPost = null, mode = "create" }) {
  console.log(initialPost);
  const [title, setTitle] = useState(initialPost?.title || JSON.parse(localStorage.getItem('postTitle')) || "");
  const [content, setContent] = useState(initialPost?.content || JSON.parse(localStorage.getItem('editorContent')) || "");
  const [featureImage, setFeatureImage] = useState(initialPost?.featureImage || null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isRTL, setIsRTL] = useState(initialPost?.isRTL || false);
  const [isRTL_, setIsRTL_] = useState(initialPost?.isRTL || false);
  const [editorKey, setEditorKey] = useState(0);
  const [status, setStatus] = useState(initialPost?.status || "published");
  const fileInputRef = useRef(null);

  const isEditMode = mode === "edit" && initialPost;

  // Auto-detect RTL text (simple Urdu/Arabic detection)
  const detectRTL = (text) => {
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text[0]);
  };

  // Upload image to Supabase storage
  const uploadImageToSupabase = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const { url } = await response.json();
    return url;
  };

  // Upload generated image to Supabase
  const uploadGeneratedImage = async (dataUrl, fileName) => {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const file = new File([blob], fileName, { type: 'image/jpeg' });
    return uploadImageToSupabase(file);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setIsRTL(detectRTL(newTitle));
    localStorage.setItem('postTitle', JSON.stringify(newTitle))
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    localStorage.setItem('editorContent', JSON.stringify(newContent))
    setIsRTL_(detectRTL(newContent));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage("❌ Image size should be less than 5MB");
        return;
      }

      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setFeatureImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const getDisplayImage = () => {
    const gradientIndexRef = useRef(
      Math.floor(Math.random() * GRADIENTS.length)
    );

    if (featureImage) return featureImage;
    if (title.trim()) return generateFeatureImage(title, gradientIndexRef.current , isRTL);
    return generateFeatureImage(isEditMode ? initialPost.title : title, gradientIndexRef.current, isRTL);
  };

  const removeImage = () => {
    setFeatureImage(null);
    setUploadedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-") // Include Urdu characters in slug
        .replace(/(^-|-$)+/g, "");

      let finalImageUrl = featureImage;

      // Handle image upload
      if (uploadedImageFile) {
        // Upload custom image
        finalImageUrl = await uploadImageToSupabase(uploadedImageFile);
      } else if (title.trim() && !featureImage) {
        // Generate and upload auto-generated image
        const generatedImageData = generateFeatureImage(title, Math.floor(Math.random() * GRADIENTS.length), isRTL);
        const fileName = `generated-${slug}-${Date.now()}.jpg`;
        finalImageUrl = await uploadGeneratedImage(generatedImageData, fileName);
      }

      const postData = {
        title,
        content,
        slug: isEditMode ? initialPost.slug : slug,
        featureImageUrl: finalImageUrl,
        isRTL,
        status
      };

      const url = isEditMode ? `/api/blog/${initialPost.id}` : "/api/blog";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage(isEditMode ? "✅ Updated " :"✅ Published " +`successfully! <a href='/blog/${slug}'>Preveiw<a/>`);

      if (!isEditMode) {
        // Reset form for new posts
        setTitle("");
        setContent("");
        setFeatureImage(null);
        setUploadedImageFile(null);
        setIsRTL(false);
        setStatus("draft");
        setEditorKey(prev => prev + 1);
        // Clear localStorage for editor content
        if (typeof window !== 'undefined') {
          localStorage.removeItem('editorContent');
          localStorage.removeItem('postTitle');
        }
      }
    } catch (err) {
      setMessage(
        err.message === "Unauthorized" ?
          <>
            ❌ Unauthorized - Please{" "}
            <a href="/auth/login" className="text-blue-500 underline">
              Login
            </a>
          </>
          : `❌ ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  function preventEnterSubmit(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Preview Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Preview Mode
            </h1>
            <button
              onClick={() => setIsPreview(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Editor
            </button>
          </div>

          {/* Preview Content */}
          <article className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* Feature Image */}
            <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600">
              <img
                src={getDisplayImage()}
                alt={title || "Feature Image"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="p-8">
              <h1 className={`text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200 ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                {title || (isEditMode ? initialPost.title : "Untitled Post")}
              </h1>

              <div
                className={`prose prose-lg max-w-none dark:prose-invert ${isRTL ? 'prose-rtl' : ''}`}
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500">No content yet...</p>' }}
                style={{
                  direction: isRTL ? 'rtl' : 'ltr',
                  lineHeight: isRTL ? '2.6' : '1.5',
                  fontFamily: isRTL ? 'Noto Nastaliq Urdu, Arial, sans-serif' : 'inherit'
                }}
              />
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto  py-8">
        <form
          className=""
          onSubmit={handleSubmit}
          onKeyDown={preventEnterSubmit}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {isEditMode ? `Edit Post: ${initialPost.title}` : "Create New Post"}
            </h1>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                disabled={!title.trim() && !content.trim()}
              >
                👁️ Preview
              </button>

              <button
                type="button"
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                onClick={() => setMessage("💾 Auto-saved")}
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (isEditMode ? "Updating..." : "Publishing...") : (isEditMode ? "Update" : "Publish")}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.toString().includes('✅')
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Title Input */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <label htmlFor="title" className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Post Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  className={`w-full px-0  border-0 border-b-2 border-gray-200 dark:border-gray-600 outline-none bg-transparent text-xl  placeholder-gray-400 focus:border-blue-500 transition-colors ${isRTL ? 'text-right font-arabic' : 'text-left'
                    }`}
                  placeholder={isRTL ? "عنوان داخل کریں" : "Enter post title"}
                  required
                  style={{
                    direction: isRTL ? 'rtl' : 'ltr',
                    fontFamily: isRTL ? 'Noto Nastaliq Urdu, Arial, sans-serif' : 'inherit',
                    fontSize: isRTL ? '1rem' : '',
                  }}
                />
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content
                  </label>
                </div>
                <div
                  className={`editor-container ${isRTL_ ? 'rtl-editor' : 'ltr-editor'}`}
                  style={{
                    direction: isRTL_ ? 'rtl' : 'ltr',
                    fontFamily: 'Poppins, Noto Nastaliq Urdu, sans-serif'
                  }}
                >
                  <SimpleEditor content={content} setContent={handleContentChange} key={editorKey} isEditMode={isEditMode} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* Feature Image Upload */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Feature Image
                </h3>

                {/* Image Preview */}
                <div className="mb-4">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={getDisplayImage()}
                      alt="Feature"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {featureImage ? 'Change Image' : 'Upload Image'}
                  </button>

                  {featureImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Use Auto-Generated
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {uploadedImageFile ? 'Custom image uploaded' :
                    featureImage ? 'Using existing image' : 'Auto-generated from title'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Quick Actions
                </h3>

                <div className="space-y-2">
                  {!isEditMode && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setTitle("");
                          setContent("");
                          setFeatureImage(null);
                          setUploadedImageFile(null);
                          setIsRTL(false);
                          setEditorKey(prev => prev + 1);
                          if (typeof window !== 'undefined') {
                            localStorage.removeItem('editorContent');
                            localStorage.removeItem('postTitle');
                          }
                          setMessage("🗑️ Draft cleared");
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:bg-blue-700 rounded transition-colors"
                      >
                        ❌ Clear Draft 
                      </button>
                    </>
                  )}

                  {isEditMode && (
                    <>
                      <button
                        type="button"
                        onClick={() => window.location.href = `/article/${initialPost.slug}`}
                        className="w-full flex justify-start gap-3 text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <span>View Post</span>
                        <span><SquareArrowOutUpRight className="size-4" /></span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.location.href = `/article`}
                        className="w-full flex justify-start gap-3 text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <span>Back to Articles</span>
                        <span><SquareArrowOutUpRight className="size-4" /></span>

                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Custom Styles */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
          
          .font-arabic {
            font-family: 'Noto Nastaliq Urdu', Arial, sans-serif;
          }
          
          .rtl-editor {
            direction: rtl;
          }
          
          .rtl-editor .ProseMirror {
            direction: rtl;
            text-align: right;
            font-family: 'Poppins', 'Noto Nastaliq Urdu', Arial, sans-serif;
          }
          
          .rtl-editor .simple-editor {
            direction: rtl;
          }
          
          .ltr-editor .ProseMirror {
            direction: ltr;
            text-align: left;
            font-family: 'Poppins', 'Noto Nastaliq Urdu', Arial, sans-serif;
          }
          
          .prose-rtl {
            direction: rtl;
            text-align: right;
          }
          
          .prose-rtl h1, 
          .prose-rtl h2, 
          .prose-rtl h3, 
          .prose-rtl h4, 
          .prose-rtl h5, 
          .prose-rtl h6 {
            text-align: right;
          }
          
          .prose-rtl p {
            text-align: right;
          }
          
          .prose-rtl ul, 
          .prose-rtl ol {
            padding-right: 1.5rem;
            padding-left: 0;
          }
          
          .editor-container {
            min-height: 400px;
          }
          
          .simple-editor-wrapper {
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .dark .simple-editor-wrapper {
            border-color: #374151;
          }
          
          .simple-editor-content {
            padding: 1rem;
            min-height: 400px;
          }
          
          .simple-editor-content .ProseMirror {
            outline: none;
            font-size: 1rem;
            line-height: 1.75;
            color: #374151;
          }
          
          .dark .simple-editor-content .ProseMirror {
            color: #d1d5db;
          }
          
          .simple-editor-content .ProseMirror p {
            margin: 0.75rem 0;
            line-height: 2.3 !important;
          }
          
          .simple-editor-content .ProseMirror h1,
          .simple-editor-content .ProseMirror h2,
          .simple-editor-content .ProseMirror h3,
          .simple-editor-content .ProseMirror h4 {
            margin: 1.5rem 0 0.75rem 0;
            font-weight: 600;
          }
          
          .simple-editor-content .ProseMirror h1 { font-size: 2rem; }
          .simple-editor-content .ProseMirror h2 { font-size: 1.5rem; }
          .simple-editor-content .ProseMirror h3 { font-size: 1.25rem; }
          .simple-editor-content .ProseMirror h4 { font-size: 1.125rem; }
          
          .simple-editor-content .ProseMirror ul,
          .simple-editor-content .ProseMirror ol {
            margin: 0.75rem 0;
            padding-left: 1.5rem;
          }
          
          .simple-editor-content .ProseMirror blockquote {
            border-left: 4px solid #e5e7eb;
            margin: 1rem 0;
            padding-left: 1rem;
            font-style: italic;
            color: #6b7280;
          }
          
          .dark .simple-editor-content .ProseMirror blockquote {
            border-left-color: #4b5563;
            color: #9ca3af;
          }
          
          .simple-editor-content .ProseMirror code {
            background-color: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875rem;
          }
          
          .dark .simple-editor-content .ProseMirror code {
            background-color: #374151;
          }
          
          .simple-editor-content .ProseMirror pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          
          .simple-editor-content .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
        `}</style>
      </div>
    </div>
  );
}