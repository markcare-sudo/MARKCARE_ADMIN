import { useState, useRef } from "react";
import { FiEdit2, FiSave, FiCamera } from "react-icons/fi";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import useAuth from "@/features/auth/useAuth";

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.tenant?.department || "",
    branch: user?.tenant?.branch || "",
    role: user?.roles[0].name || "",
  });

  const [original, setOriginal] = useState(form);
  const [errors, setErrors] = useState({});
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  // ===== FIELD CONFIGURATION =====
  const isPlatformUser = user?.isPlatformUser;

  const fields = [
    { key: "name", label: "Name", editable: true },
    { key: "email", label: "Email", editable: true },
    { key: "phone", label: "Phone", editable: true },
    // Only include these if it's NOT a platform user
    ...(!isPlatformUser ? [
      { key: "department", label: "Department", editable: true },
      { key: "branch", label: "Branch", editable: true }
    ] : []),
    { key: "role", label: "Role", editable: false },
  ];

  // ===== Avatar Upload =====
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return alert("Invalid image");
    if (file.size > 2 * 1024 * 1024)
      return alert("Image must be under 2MB");

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  //   const validate = () => {
  //     const err = {};

  //     if (!form.name) err.name = "Name required";
  //     if (!form.email) err.email = "Email required";
  //     if (!form.phone) err.phone = "Phone number required";

  //     return err;
  // };


  // ===== Save Handler =====
  const handleSave = async () => {
    try {
      setLoading(true);

      if (!form.name) {
        setErrors({ name: "Name is required" });
        return;
      }

      setErrors({});

      if (form.email !== original.email) {
        setShowEmailOtp(true);
        return;
      }

      if (form.phone !== original.phone) {
        setShowPhoneOtp(true);
        return;
      }

      await updateProfile();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setOriginal(form);
    setEditing(false);
  };

  return (
    <div className="space-y-6">

      <PageHeader
        title="Profile"
        subtitle="Manage your personal information"
        breadcrumb="Settings / Profile"
        action={
          !editing ? (
            <Button
              variant="outline"
              leftIcon={<FiEdit2 size={16} />}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="primary"
              loading={loading}
              leftIcon={<FiSave size={16} />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== LEFT CARD ===== */}
        <Card className="text-center">
          <div className="flex flex-col items-center space-y-4">

            <div className="relative group cursor-pointer">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <Avatar name={form.name} size={12} />
              )}

              {editing && (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <FiCamera className="text-white text-xl" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />

            <h2 className="text-lg font-semibold">{form.name}</h2>
            <p className="text-sm text-gray-500">{form.email}</p>
            <Badge text="Active" variant="green" />

          </div>
        </Card>

        {/* ===== RIGHT SIDE ===== */}
        <div className="lg:col-span-2 space-y-6">

          <Card>
            <SectionHeader title="Personal Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {fields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  placeholder={field.label}
                  value={form[field.key]}
                  disabled={!editing || !field.editable}
                  error={errors[field.key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.key]: e.target.value,
                    })
                  }
                />
              ))}
            </div>

            {editing && (
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  loading={loading}
                  leftIcon={<FiSave size={16} />}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ===== EMAIL OTP MODAL ===== */}
      {showEmailOtp && (
        <OtpModal
          title="Verify Email"
          otp={emailOtp}
          setOtp={setEmailOtp}
          onVerify={updateProfile}
          onClose={() => setShowEmailOtp(false)}
        />
      )}

      {/* ===== PHONE OTP MODAL ===== */}
      {showPhoneOtp && (
        <OtpModal
          title="Verify Phone"
          otp={phoneOtp}
          setOtp={setPhoneOtp}
          onVerify={updateProfile}
          onClose={() => setShowPhoneOtp(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;


/* ===== REUSABLE OTP MODAL ===== */
const OtpModal = ({ title, otp, setOtp, onVerify, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        <Input
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" onClick={onVerify}>
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};









// import { useState, useRef, useEffect, useCallback } from "react";
// import { FiEdit2, FiSave, FiCamera } from "react-icons/fi";
// import { toast } from "react-hot-toast"; // Assuming you use react-hot-toast

// import Avatar from "@/components/ui/Avatar";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import Input from "@/components/ui/Input";
// import PageHeader from "@/components/ui/PageHeader";
// import SectionHeader from "@/components/ui/SectionHeader";
// import useAuth from "@/features/auth/useAuth";

// const ProfilePage = () => {
//   const { user, updateProfile: authUpdateProfile, getMe } = useAuth();

//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     department: "",
//     branch: "",
//     role: "",
//   });

//   const [original, setOriginal] = useState({});
//   const [errors, setErrors] = useState({});

//   const [showEmailOtp, setShowEmailOtp] = useState(false);
//   const [showPhoneOtp, setShowPhoneOtp] = useState(false);
//   const [emailOtp, setEmailOtp] = useState("");
//   const [phoneOtp, setPhoneOtp] = useState("");

//   // ===== 1. GET ME API INTEGRATION =====
//   const loadProfile = useCallback(async () => {
//     try {
//       setFetching(true);
//       // Assuming refreshUser calls the getMe API and updates the auth state
//       const latestUser = await getMe();

//       const userData = {
//         name: latestUser?.name || "",
//         email: latestUser?.email || "",
//         phone: latestUser?.phone || "",
//         department: latestUser?.tenant?.department || "",
//         branch: latestUser?.tenant?.branch || "",
//         role: latestUser?.roles?.[0]?.name || "User",
//       };

//       setForm(userData);
//       setOriginal(userData);
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setFetching(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   const isPlatformUser = user?.isPlatformUser;

//   const fields = [
//     { key: "name", label: "Name", editable: true },
//     { key: "email", label: "Email", editable: true },
//     { key: "phone", label: "Phone", editable: true },
//     ...(!isPlatformUser ? [
//       { key: "department", label: "Department", editable: true },
//       { key: "branch", label: "Branch", editable: true }
//     ] : []),
//     { key: "role", label: "Role", editable: false },
//   ];

//   // ===== 2. VALIDATION LOGIC =====
//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!form.name.trim()) newErrors.name = "Full name is required";

//     if (!form.email.trim()) {
//       newErrors.email = "Email address is required";
//     } else if (!emailRegex.test(form.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!form.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (form.phone.trim().length < 10) {
//       newErrors.phone = "Phone number must be at least 10 digits";
//     }

//     if (!isPlatformUser && !form.department.trim()) {
//       newErrors.department = "Department is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) return toast.error("Invalid image format");
//     if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");

//     const reader = new FileReader();
//     reader.onloadend = () => setAvatarPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleSave = async () => {
//     if (!validate()) return;

//     try {
//       setLoading(true);

//       // Check if critical fields changed to trigger OTP
//       if (form.email !== original.email) {
//         setShowEmailOtp(true);
//         return;
//       }

//       if (form.phone !== original.phone) {
//         setShowPhoneOtp(true);
//         return;
//       }

//       await finalizeUpdate();
//     } catch (err) {
//       toast.error(err.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const finalizeUpdate = async () => {
//     try {
//       // Assuming your auth context has an updateProfile function that calls the backend
//       await authUpdateProfile(form);
//       setOriginal(form);
//       setEditing(false);
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       toast.error("Failed to sync profile with server");
//     }
//   };

//   if (fetching) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Profile"
//         subtitle="Manage your personal information"
//         breadcrumb="Settings / Profile"
//         action={
//           !editing ? (
//             <Button
//               variant="outline"
//               leftIcon={<FiEdit2 size={16} />}
//               onClick={() => setEditing(true)}
//             >
//               Edit Profile
//             </Button>
//           ) : (
//             <Button
//               variant="primary"
//               loading={loading}
//               leftIcon={<FiSave size={16} />}
//               onClick={handleSave}
//             >
//               Save Changes
//             </Button>
//           )
//         }
//       />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="text-center">
//           <div className="flex flex-col items-center space-y-4">
//             <div className="relative group cursor-pointer">
//               {avatarPreview ? (
//                 <img src={avatarPreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
//               ) : (
//                 <Avatar name={form.name} size={12} />
//               )}
//               {editing && (
//                 <div
//                   onClick={() => fileInputRef.current.click()}
//                   className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
//                 >
//                   <FiCamera className="text-white text-xl" />
//                 </div>
//               )}
//             </div>
//             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
//             <h2 className="text-lg font-semibold">{form.name || "User Name"}</h2>
//             <p className="text-sm text-gray-500">{form.email}</p>
//             <Badge text="Active" variant="green" />
//           </div>
//         </Card>

//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <SectionHeader title="Personal Information" />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//               {fields.map((field) => (
//                 <Input
//                   key={field.key}
//                   label={field.label}
//                   placeholder={`Enter your ${field.label.toLowerCase()}`}
//                   value={form[field.key]}
//                   disabled={!editing || !field.editable}
//                   error={errors[field.key]}
//                   onChange={(e) => {
//                     setForm({ ...form, [field.key]: e.target.value });
//                     // Clear error when user starts typing
//                     if (errors[field.key]) setErrors({ ...errors, [field.key]: null });
//                   }}
//                 />
//               ))}
//             </div>

//             {editing && (
//               <div className="mt-6 flex justify-end gap-3">
//                 <Button variant="ghost" onClick={() => { setForm(original); setEditing(false); setErrors({}); }}>
//                   Cancel
//                 </Button>
//                 <Button variant="primary" loading={loading} onClick={handleSave}>
//                   Save
//                 </Button>
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>

//       {/* MODALS */}
//       {showEmailOtp && (
//         <OtpModal title="Verify New Email" otp={emailOtp} setOtp={setEmailOtp} onVerify={finalizeUpdate} onClose={() => setShowEmailOtp(false)} />
//       )}
//       {showPhoneOtp && (
//         <OtpModal title="Verify New Phone" otp={phoneOtp} setOtp={setPhoneOtp} onVerify={finalizeUpdate} onClose={() => setShowPhoneOtp(false)} />
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

// const OtpModal = ({ title, otp, setOtp, onVerify, onClose }) => (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//     <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4 shadow-xl">
//       <h2 className="text-lg font-semibold">{title}</h2>
//       <p className="text-xs text-gray-500">We've sent a code to your updated contact info.</p>
//       <Input label="One-Time Password" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" />
//       <div className="flex justify-end gap-2">
//         <Button variant="ghost" onClick={onClose}>Cancel</Button>
//         <Button variant="primary" onClick={onVerify} disabled={otp.length < 4}>Verify & Save</Button>
//       </div>
//     </div>
//   </div>
// );