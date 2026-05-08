// import { useEffect, useState, useMemo, useRef } from "react";
// import { FiUpload, FiX } from "react-icons/fi";
// import { X } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// // UI Components
// import Input from "@/components/ui/Input";
// import Button from "@/components/ui/Button";
// import Select from "@/components/ui/Select";

// // Hooks/Context
// import { useBlogs } from "@/context/BlogContext";
// import { useGlobalContext } from "@/context/GlobalContext";

// const BLOG_CATEGORIES = [
//     "Water Treatment Plants",
//     "RO Water Purifier",
//     "Reverse Osmosis Plant",
//     "Residential Elevator",
//     "Sewage Treatment Plant",
//     "Diesel Generator",
//     "Water Softening Plant",
//     "AC Service",
//     "Solar Power System",
//     "Refrigerators",
//     "UPS System",
//     "Geysers",
//     "Solar walls",
//     "Centralized HVAC",
//     "Washing Machine",
//     "TV",
//     "Effluent Treatment Plant",
// ];

// const INITIAL_FORM_STATE = {
//     title: "",
//     excerpt: "",
//     content: "",
//     category: "",
//     status: "draft",
//     tags: [],
//     keywords: [],
//     featured_media: null,
//     preview: null,
//     alt_text: "",
//     media_type: "image",
// };

// const BlogForm = ({ initialData, onSuccess }) => {
//     const { createBlog, updateBlog } = useBlogs();

//     const {
//         getImageUrl,
//         tags = [],
//         keywords = [],
//     } = useGlobalContext();

//     const [loading, setLoading] = useState(false);

//     const [form, setForm] =
//         useState(INITIAL_FORM_STATE);

//     const [tagInput, setTagInput] =
//         useState("");

//     const [keywordInput, setKeywordInput] =
//         useState("");

//     // ==============================
//     // QUILL CONFIG
//     // ==============================

//     const quillConfig = useMemo(() => ({
//         modules: {
//             toolbar: [
//                 [{ header: [1, 2, 3, false] }],
//                 ["bold", "italic", "underline", "strike"],
//                 [{ color: [] }, { background: [] }],
//                 [{ list: "ordered" }, { list: "bullet" }],
//                 ["link", "image"],
//                 ["clean"],
//             ],
//         },

//         formats: [
//             "header",
//             "bold",
//             "italic",
//             "underline",
//             "strike",
//             "color",
//             "background",
//             "list",
//             "bullet",
//             "link",
//             "image",
//         ],
//     }), []);

//     // ==============================
//     // INITIALIZE FORM
//     // ==============================

//     useEffect(() => {

//         if (!initialData) {

//             setForm(INITIAL_FORM_STATE);

//             return;
//         }

//         const parsedTags =
//             Array.isArray(initialData.tags || initialData.Tags)
//                 ? (initialData.tags || initialData.Tags)
//                     .map((t) => {

//                         if (typeof t === "string") {
//                             return t;
//                         }

//                         return t.name || t.label;
//                     })
//                     .filter(Boolean)
//                 : [];

//         const parsedKeywords =
//             Array.isArray(initialData.keywords || initialData.Keywords)
//                 ? (initialData.keywords || initialData.Keywords)
//                     .map((k) => {

//                         if (typeof k === "string") {
//                             return k;
//                         }

//                         return k.keyword || k.name;
//                     })
//                     .filter(Boolean)
//                 : [];

//         setForm({
//             title: initialData.title || "",
//             excerpt: initialData.excerpt || "",
//             content: initialData.content || "",
//             category: initialData.category || "",
//             status: initialData.status || "draft",
//             tags: parsedTags,
//             keywords: parsedKeywords,
//             featured_media: null,
//             preview: initialData.featured_media
//                 ? getImageUrl(initialData.featured_media)
//                 : null,
//             alt_text: initialData.alt_text || "",
//             media_type: initialData.media_type || "image",
//         });

//     }, [initialData, getImageUrl]);

//     // ==============================
//     // CLEANUP OBJECT URL
//     // ==============================

//     useEffect(() => {

//         return () => {

//             if (
//                 form.preview &&
//                 form.preview.startsWith("blob:")
//             ) {

//                 URL.revokeObjectURL(form.preview);
//             }
//         };

//     }, [form.preview]);

//     // ==============================
//     // UPDATE FIELD
//     // ==============================

//     const updateField = (field, value) => {

//         setForm((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//     };

//     // ==============================
//     // HANDLE MEDIA
//     // ==============================

//     const handleMediaChange = (file) => {

//         if (!file) return;

//         updateField("featured_media", file);

//         updateField(
//             "preview",
//             URL.createObjectURL(file)
//         );

//         updateField(
//             "media_type",
//             file.type.startsWith("video")
//                 ? "video"
//                 : "image"
//         );
//     };

//     // ==============================
//     // ADD ITEM
//     // ==============================

//     const addItem = (type, value) => {

//         const trimmed =
//             value.trim().toLowerCase();

//         if (
//             !trimmed ||
//             form[type].includes(trimmed)
//         ) {
//             return;
//         }

//         setForm((prev) => ({
//             ...prev,
//             [type]: [
//                 ...prev[type],
//                 trimmed,
//             ],
//         }));

//         if (type === "tags") {
//             setTagInput("");
//         } else {
//             setKeywordInput("");
//         }
//     };

//     // ==============================
//     // SUBMIT
//     // ==============================

//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         setLoading(true);

//         try {

//             const formData =
//                 new FormData();

//             const fields = [
//                 "title",
//                 "excerpt",
//                 "content",
//                 "category",
//                 "status",
//                 "alt_text",
//             ];

//             fields.forEach((field) => {

//                 formData.append(
//                     field,
//                     form[field]
//                 );
//             });

//             formData.append(
//                 "tags",
//                 JSON.stringify(form.tags)
//             );

//             formData.append(
//                 "keywords",
//                 JSON.stringify(form.keywords)
//             );

//             if (form.featured_media) {

//                 formData.append(
//                     "featured_media",
//                     form.featured_media
//                 );
//             }

//             if (initialData?.id) {

//                 await updateBlog(
//                     initialData.id,
//                     formData
//                 );

//             } else {

//                 await createBlog(
//                     formData
//                 );
//             }

//             onSuccess?.();

//         } catch (error) {

//             console.error(
//                 "Submission Error:",
//                 error
//             );

//             alert(
//                 "Failed to save blog. Please try again."
//             );

//         } finally {

//             setLoading(false);
//         }
//     };

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="space-y-8"
//         >

//             {/* ==============================
//                 MAIN CONTENT
//             ============================== */}

//             <div className="space-y-4">

//                 <Input
//                     label="Blog Title"
//                     placeholder="Enter a catchy title..."
//                     value={form.title}
//                     onChange={(e) =>
//                         updateField(
//                             "title",
//                             e.target.value
//                         )
//                     }
//                     required
//                 />

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                     <Select
//                         label="Category"
//                         value={form.category}
//                         onChange={(e) =>
//                             updateField(
//                                 "category",
//                                 e.target.value
//                             )
//                         }
//                         options={BLOG_CATEGORIES}
//                     />

//                     <Select
//                         label="Status"
//                         value={form.status}
//                         onChange={(e) =>
//                             updateField(
//                                 "status",
//                                 e.target.value
//                             )
//                         }
//                         options={[
//                             "draft",
//                             "published",
//                             "archived",
//                         ]}
//                     />

//                     <Input
//                         label="Alt Text"
//                         placeholder="Describe the media"
//                         value={form.alt_text}
//                         onChange={(e) =>
//                             updateField(
//                                 "alt_text",
//                                 e.target.value
//                             )
//                         }
//                     />

//                 </div>

//                 <Input
//                     label="Excerpt"
//                     multiline
//                     rows={3}
//                     placeholder="A brief summary for SEO and lists..."
//                     value={form.excerpt}
//                     onChange={(e) =>
//                         updateField(
//                             "excerpt",
//                             e.target.value
//                         )
//                     }
//                 />

//                 {/* ==============================
//                     CONTENT EDITOR
//                 ============================== */}

//                 <div className="space-y-2">

//                     <label className="text-sm font-semibold text-gray-700">
//                         Content
//                     </label>

//                     <div className="border border-gray-200 rounded-xl overflow-hidden">

//                         <ReactQuill
//                             theme="snow"
//                             value={form.content}
//                             onChange={(val) =>
//                                 updateField(
//                                     "content",
//                                     val
//                                 )
//                             }
//                             modules={
//                                 quillConfig.modules
//                             }
//                             formats={
//                                 quillConfig.formats
//                             }
//                             className="bg-white"
//                         />

//                     </div>

//                 </div>

//             </div>

//             {/* ==============================
//                 TAGS & KEYWORDS
//             ============================== */}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl">

//                 <MetaInput
//                     label="Tags"
//                     input={tagInput}
//                     setInput={setTagInput}
//                     items={form.tags}
//                     addItem={(val) =>
//                         addItem(
//                             "tags",
//                             val
//                         )
//                     }
//                     removeItem={(tag) =>
//                         setForm((prev) => ({
//                             ...prev,
//                             tags: prev.tags.filter(
//                                 (t) => t !== tag
//                             ),
//                         }))
//                     }
//                     color="red"
//                     allSuggestions={tags}
//                 />

//                 <MetaInput
//                     label="Keywords"
//                     input={keywordInput}
//                     setInput={setKeywordInput}
//                     items={form.keywords}
//                     addItem={(val) =>
//                         addItem(
//                             "keywords",
//                             val
//                         )
//                     }
//                     removeItem={(kw) =>
//                         setForm((prev) => ({
//                             ...prev,
//                             keywords:
//                                 prev.keywords.filter(
//                                     (k) => k !== kw
//                                 ),
//                         }))
//                     }
//                     color="blue"
//                     allSuggestions={keywords}
//                 />

//             </div>

//             {/* ==============================
//                 MEDIA
//             ============================== */}

//             <div className="space-y-3">

//                 <label className="text-sm font-semibold text-gray-700">
//                     Featured Media
//                 </label>

//                 <div className="flex items-center gap-4">

//                     <label className="group relative w-40 h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden bg-white cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">

//                         {form.preview ? (

//                             form.media_type === "video" ? (

//                                 <video
//                                     src={form.preview}
//                                     className="w-full h-full object-cover"
//                                 />

//                             ) : (

//                                 <img
//                                     src={form.preview}
//                                     alt="Preview"
//                                     className="w-full h-full object-cover"
//                                 />

//                             )

//                         ) : (

//                             <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-blue-500">

//                                 <FiUpload size={24} />

//                                 <span className="text-xs font-medium">
//                                     Click to Upload
//                                 </span>

//                             </div>

//                         )}

//                         <input
//                             hidden
//                             type="file"
//                             accept="image/*,video/*"
//                             onChange={(e) =>
//                                 handleMediaChange(
//                                     e.target.files?.[0]
//                                 )
//                             }
//                         />

//                     </label>

//                     {form.preview && (

//                         <button
//                             type="button"
//                             onClick={() => {

//                                 updateField(
//                                     "featured_media",
//                                     null
//                                 );

//                                 updateField(
//                                     "preview",
//                                     null
//                                 );
//                             }}
//                             className="p-3 bg-white border border-gray-200 rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-colors"
//                             title="Remove media"
//                         >

//                             <FiX size={20} />

//                         </button>

//                     )}

//                 </div>

//             </div>

//             {/* ==============================
//                 FOOTER
//             ============================== */}

//             <div className="flex justify-end pt-4 border-t">

//                 <Button
//                     type="submit"
//                     disabled={loading}
//                     size="lg"
//                     className="min-w-[150px]"
//                 >

//                     {loading
//                         ? "Saving..."
//                         : initialData?.id
//                             ? "Update Blog"
//                             : "Create Blog"}

//                 </Button>

//             </div>

//         </form>
//     );
// };

// function MetaInput({
//     label,
//     input,
//     setInput,
//     items = [],
//     addItem,
//     removeItem,
//     color,
//     allSuggestions = [],
// }) {

//     const [showSuggestions, setShowSuggestions] =
//         useState(false);

//     const suggestionRef =
//         useRef(null);

//     const colorClasses =
//         color === "red"
//             ? "bg-red-100 text-red-600 border-red-200"
//             : "bg-blue-100 text-blue-600 border-blue-200";

//     const handleCommaSeparatedAdd = (value) => {

//         if (
//             !value ||
//             typeof value !== "string"
//         ) {
//             return;
//         }

//         if (!value.includes(",")) {

//             addItem(value);

//             setInput("");

//             return;
//         }

//         const parts = value
//             .split(",")
//             .map((p) => p.trim())
//             .filter(Boolean);

//         parts.forEach((part) =>
//             addItem(part)
//         );

//         setInput("");
//     };

//     const filteredSuggestions =
//         useMemo(() => {

//             const suggestionsArray =
//                 Array.isArray(allSuggestions)
//                     ? allSuggestions
//                     : [];

//             if (
//                 !input.trim() ||
//                 suggestionsArray.length === 0
//             ) {
//                 return [];
//             }

//             const search =
//                 input.toLowerCase();

//             return suggestionsArray
//                 .filter((s) => {

//                     const suggestionText =
//                         s?.name ||
//                         s?.keyword ||
//                         s;

//                     if (!suggestionText) {
//                         return false;
//                     }

//                     const normalized =
//                         suggestionText.toLowerCase();

//                     return (
//                         normalized.includes(search) &&
//                         !items.some(
//                             (item) =>
//                                 item.toLowerCase() ===
//                                 normalized
//                         )
//                     );
//                 })
//                 .slice(0, 5);

//         }, [input, allSuggestions, items]);

//     useEffect(() => {

//         const handleClickOutside = (e) => {

//             if (
//                 suggestionRef.current &&
//                 !suggestionRef.current.contains(
//                     e.target
//                 )
//             ) {

//                 setShowSuggestions(false);
//             }
//         };

//         document.addEventListener(
//             "mousedown",
//             handleClickOutside
//         );

//         return () => {

//             document.removeEventListener(
//                 "mousedown",
//                 handleClickOutside
//             );
//         };

//     }, []);

//     return (
//         <div
//             className="space-y-2 relative"
//             ref={suggestionRef}
//         >

//             <label className="text-sm font-semibold text-gray-700">
//                 {label}
//             </label>

//             <div className="w-full bg-white border border-gray-200 rounded-xl p-3 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500">

//                 {(Array.isArray(items)
//                     ? items
//                     : []
//                 ).map((item) => (

//                     <div
//                         key={item}
//                         className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${colorClasses}`}
//                     >

//                         {item}

//                         <button
//                             type="button"
//                             onClick={() =>
//                                 removeItem(item)
//                             }
//                         >

//                             <X size={12} />

//                         </button>

//                     </div>

//                 ))}

//                 <input
//                     value={input}
//                     onFocus={() =>
//                         setShowSuggestions(true)
//                     }
//                     onChange={(e) => {

//                         const val =
//                             e.target.value;

//                         if (val.includes(",")) {

//                             handleCommaSeparatedAdd(
//                                 val
//                             );

//                             setShowSuggestions(false);

//                         } else {

//                             setInput(val);

//                             setShowSuggestions(true);
//                         }
//                     }}
//                     onKeyDown={(e) => {

//                         if (e.key === "Enter") {

//                             e.preventDefault();

//                             handleCommaSeparatedAdd(
//                                 input
//                             );

//                             setShowSuggestions(false);
//                         }
//                     }}
//                     placeholder={`Add ${label.toLowerCase()}...`}
//                     className="flex-1 bg-transparent outline-none min-w-[150px] text-sm"
//                 />

//             </div>

//             {showSuggestions &&
//                 filteredSuggestions.length > 0 && (

//                     <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">

//                         {filteredSuggestions.map((s) => {

//                             const displayName =
//                                 s.name ||
//                                 s.keyword ||
//                                 s;

//                             return (

//                                 <button
//                                     key={
//                                         s.id ||
//                                         displayName
//                                     }
//                                     type="button"
//                                     className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition flex items-center justify-between"
//                                     onClick={() => {

//                                         addItem(
//                                             displayName
//                                         );

//                                         setShowSuggestions(
//                                             false
//                                         );

//                                         setInput("");
//                                     }}
//                                 >

//                                     <span>
//                                         {displayName}
//                                     </span>

//                                     <span className="text-[10px] text-gray-400">
//                                         Use existing
//                                     </span>

//                                 </button>

//                             );
//                         })}

//                     </div>

//                 )}

//         </div>
//     );
// }

// export default BlogForm;








import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import { useBlogForm } from "./useBlogForm";
import MetaInput from "./MetaInput";
import MediaUpload from "./MediaUpload";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useGlobalContext } from "@/context/GlobalContext"; // Import the context

const BLOG_CATEGORIES = [
    "Water Treatment Plants",
    "RO Water Purifier",
    "Reverse Osmosis Plant",
    "Residential Elevator",
    "Sewage Treatment Plant",
    "Diesel Generator",
    "Water Softening Plant",
    "AC Service",
    "Solar Power System",
    "Refrigerators",
    "UPS System",
    "Geysers",
    "Solar walls",
    "Centralized HVAC",
    "Washing Machine",
    "TV",
    "Effluent Treatment Plant",
];

const BlogForm = ({ initialData, onSuccess }) => {
    // 1. Get suggestions from Global Context
    const { tags: globalTags, keywords: globalKeywords } = useGlobalContext();

    // 2. Initialize form logic
    const { form, loading, updateField, handleSubmit } = useBlogForm(initialData, onSuccess);

    const quillConfig = useMemo(() => ({
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                ["link", "image"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"]
            ]
        }
    }), []);

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Core Info */}
            <section className="space-y-4">
                <Input
                    label="Blog Title"
                    placeholder="Enter blog title..."
                    value={form.title}
                    onChange={e => updateField("title", e.target.value)}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        label="Category"
                        value={form.category}
                        options={BLOG_CATEGORIES}
                        onChange={e => updateField("category", e.target.value)}
                    />
                    <Select
                        label="Status"
                        value={form.status}
                        options={["draft", "published", "archived"]}
                        onChange={e => updateField("status", e.target.value)}
                    />
                    <Input
                        label="Alt Text"
                        placeholder="Image description..."
                        value={form.alt_text}
                        onChange={e => updateField("alt_text", e.target.value)}
                    />
                </div>

                <Input
                    label="Excerpt"
                    multiline
                    rows={2}
                    placeholder="Short summary for SEO..."
                    value={form.excerpt}
                    onChange={e => updateField("excerpt", e.target.value)}
                />

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Content</label>
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                        <ReactQuill
                            theme="snow"
                            value={form.content}
                            onChange={val => updateField("content", val)}
                            modules={quillConfig.modules}
                        />
                    </div>
                </div>
            </section>

            {/* Tags & SEO */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <MetaInput
                    label="Tags"
                    items={form.tags}
                    color="red"
                    allSuggestions={globalTags} // Corrected reference
                    onUpdate={tags => updateField("tags", tags)}
                />
                <MetaInput
                    label="Keywords"
                    items={form.keywords}
                    color="blue"
                    allSuggestions={globalKeywords} // Corrected reference
                    onUpdate={kws => updateField("keywords", kws)}
                />
            </section>

            {/* Media Section */}
            <MediaUpload form={form} updateField={updateField} />

            {/* Form Actions */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button type="submit" disabled={loading} size="lg" className="px-10">
                    {loading ? "Saving..." : initialData?.id ? "Update Blog" : "Create Blog"}
                </Button>
            </div>
        </form>
    );
};

export default BlogForm;