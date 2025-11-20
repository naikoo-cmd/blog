import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import { createBlog, getAllTags, createTag, deleteTag } from "../../utils/api.js";
import ConfirmModal from "../../components/admin/ConfirmModal.jsx";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tag: "",
    description: "",
    content: "",
    thumbnail: null,
    images: [],
  });

  const [tags, setTags] = useState([]);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, tagId: null, isPredefined: false });
  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  // Fetch tags on mount
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      if (response.success && response.data) {
        setTags(response.data);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  // Prevent double form clear logic
  const clearForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      tag: "",
      description: "",
      content: "",
      thumbnail: null,
      images: [],
    });
    setThumbnailPreview(null);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (imagesInputRef.current) {
      imagesInputRef.current.value = "";
    }
    if (editor) {
      editor.commands.clearContent();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Color,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[300px] p-4",
        "data-placeholder": "Write your blog post content here...",
      },
    },
  });

  // Update editor content when formData.content changes externally (e.g., clear form)
  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB", "error");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate all files
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        invalidFiles.push(file.name);
      } else if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      showToast(`Invalid files: ${invalidFiles.join(", ")}`, "error");
    }

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));

      // Create previews
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
    }));
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      showToast("Tag name is required", "error");
      return;
    }

    try {
      const response = await createTag(newTagName.trim(), newTagName.trim());
      if (response.success) {
        setTags((prev) => [...prev, response.data]);
        setFormData((prev) => ({ ...prev, tag: response.data.displayName }));
        setNewTagName("");
        setShowCreateTag(false);
        showToast("Tag created successfully", "success");
      }
    } catch (err) {
      showToast(err.message || "Failed to create tag", "error");
    }
  };

  const handleDeleteTagClick = (tagId, isPredefined) => {
    if (isPredefined) {
      showToast("Cannot delete predefined tags", "error");
      return;
    }
    setConfirmModal({ isOpen: true, tagId, isPredefined });
  };

  const handleDeleteTagConfirm = async () => {
    const { tagId } = confirmModal;
    if (!tagId) return;

    try {
      await deleteTag(tagId);
      setTags((prev) => prev.filter((tag) => tag._id !== tagId));
      if (formData.tag === tags.find((t) => t._id === tagId)?.displayName) {
        setFormData((prev) => ({ ...prev, tag: "" }));
      }
      showToast("Tag deleted successfully", "success");
      setConfirmModal({ isOpen: false, tagId: null, isPredefined: false });
    } catch (err) {
      showToast(err.message || "Failed to delete tag", "error");
    }
  };

  const handleDeleteTagCancel = () => {
    setConfirmModal({ isOpen: false, tagId: null, isPredefined: false });
  };

  // Improved toast UX, properly clears timeout
  const toastTimeoutRef = useRef(null);
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  // FIX: Ensure unmount clears toast timeouts
  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e, status = "published") => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      showToast("Blog title is required", "error");
      setIsSubmitting(false);
      return;
    }

    if (!formData.tag.trim()) {
      showToast("Blog tag is required", "error");
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      showToast("Blog description is required", "error");
      setIsSubmitting(false);
      return;
    }

    // Check if content has actual text (strip HTML tags)
    const contentText = formData.content.replace(/<[^>]*>/g, "").trim();
    if (!contentText) {
      showToast("Blog content is required", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      // Send blog data to API
      // description: textarea (brief summary)
      // content: rich text editor (full blog content)
      await createBlog({
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        tag: formData.tag.trim(),
        description: formData.description.trim(), // Brief description from textarea
        content: formData.content, // Rich text content from editor
        thumbnail: formData.thumbnail,
        images: formData.images,
        status: status, // Add status field
      });

      showToast(
        status === "published"
          ? "Blog post created and published successfully!"
          : "Blog post saved as draft successfully!",
        "success"
      );
      clearForm();
    } catch (error) {
      console.error("Error creating blog:", error);
      showToast(error.message || "Failed to create blog post. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (e) => {
    await handleSubmit(e, "draft");
  };

  // Toolbar button component
  const MenuButton = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-3 py-2 rounded transition ${
        isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleDeleteTagCancel}
        onConfirm={handleDeleteTagConfirm}
        title="Delete Tag"
        message="Are you sure you want to delete this tag? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-7 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl font-semibold text-sm z-50 transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-primary text-white"
          }`}
          data-testid="toast"
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Blog Post</h1>
          <p className="text-gray-600">Fill in the details below to create a new blog post</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="space-y-6">
            {/* Blog Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-gray-50 hover:bg-white"
                required
                autoFocus
              />
            </div>

            {/* Blog Subtitle */}
            <div>
              <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Enter blog subtitle (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Blog Tag */}
            <div>
              <label htmlFor="tag" className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Tag <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-gray-50 hover:bg-white"
                  required
                >
                  <option value="">Select a tag</option>
                  {tags.map((tag) => (
                    <option key={tag._id} value={tag.displayName}>
                      {tag.displayName}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTag(!showCreateTag)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    {showCreateTag ? "Cancel" : "+ Create New Tag"}
                  </button>
                  {showCreateTag && (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Enter tag name"
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCreateTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCreateTag}
                        className="px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm"
                      >
                        Create
                      </button>
                    </div>
                  )}
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {tags.map((tag) => (
                      <div key={tag._id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{tag.displayName}</span>
                        {!tag.isPredefined && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTagClick(tag._id, tag.isPredefined)}
                            className="text-red-500 hover:text-red-700 text-sm"
                            title="Delete tag"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Blog Thumbnail/Picture Upload (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Thumbnail (Optional)</label>
              {!thumbnailPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleThumbnailChange}
                    accept="image/*"
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 mb-1">Click to upload thumbnail</span>
                    <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-64 object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                  >
                    Remove Thumbnail
                  </button>
                </div>
              )}
            </div>

            {/* Additional Images Upload (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Images (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  ref={imagesInputRef}
                  onChange={handleImagesChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="images-upload"
                />
                <label htmlFor="images-upload" className="cursor-pointer flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 mb-1">Click to upload additional images</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</span>
                </label>
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a brief description of your blog post"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-gray-50 hover:bg-white resize-y"
                required
              />
              <p className="mt-1 text-xs text-gray-500">This will be shown in the blog preview</p>
            </div>

            {/* Blog Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Content <span className="text-red-500">*</span>
              </label>

              {/* Toolbar */}
              {editor && (
                <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-2">
                  {/* Headings */}
                  <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                      isActive={editor.isActive("heading", { level: 1 })}
                      title="Heading 1"
                    >
                      H1
                    </MenuButton>
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                      isActive={editor.isActive("heading", { level: 2 })}
                      title="Heading 2"
                    >
                      H2
                    </MenuButton>
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                      isActive={editor.isActive("heading", { level: 3 })}
                      title="Heading 3"
                    >
                      H3
                    </MenuButton>
                  </div>

                  {/* Text Formatting */}
                  <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      isActive={editor.isActive("bold")}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </MenuButton>
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      isActive={editor.isActive("italic")}
                      title="Italic"
                    >
                      <em>I</em>
                    </MenuButton>
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      isActive={editor.isActive("strike")}
                      title="Strikethrough"
                    >
                      <s>S</s>
                    </MenuButton>
                  </div>

                  {/* Lists */}
                  <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      isActive={editor.isActive("bulletList")}
                      title="Bullet List"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                    </MenuButton>
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      isActive={editor.isActive("orderedList")}
                      title="Numbered List"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 15a1 1 0 100 2h12a1 1 0 100-2H4z" />
                      </svg>
                    </MenuButton>
                  </div>

                  {/* Blockquote and Code */}
                  <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleBlockquote().run()}
                      isActive={editor.isActive("blockquote")}
                      title="Quote"
                    >
                      "
                    </MenuButton>
                    <MenuButton
                      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                      isActive={editor.isActive("codeBlock")}
                      title="Code Block"
                    >
                      &lt;/&gt;
                    </MenuButton>
                  </div>

                  {/* Link and Image */}
                  <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <MenuButton
                      onClick={() => {
                        const url = window.prompt("Enter URL:");
                        if (url) {
                          editor.chain().focus().setLink({ href: url }).run();
                        }
                      }}
                      isActive={editor.isActive("link")}
                      title="Add Link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </MenuButton>
                    <MenuButton
                      onClick={() => {
                        const url = window.prompt("Enter image URL:");
                        if (url) {
                          editor.chain().focus().setImage({ src: url }).run();
                        }
                      }}
                      title="Add Image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </MenuButton>
                  </div>

                  {/* Color Picker */}
                  <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <input
                      type="color"
                      onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      title="Text Color"
                    />
                  </div>

                  {/* Clear Formatting */}
                  <MenuButton
                    onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                    title="Clear Formatting"
                  >
                    Clear
                  </MenuButton>
                </div>
              )}

              {/* Editor Content */}
              <div className="border border-t-0 border-gray-300 rounded-b-lg bg-white min-h-[300px]">
                <EditorContent editor={editor} />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Use the toolbar above for formatting (headings, bold, lists, links, images, etc.)
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none sm:px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isSubmitting ? "Creating..." : "Publish Blog Post"}
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none sm:px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Clear Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBlog;
