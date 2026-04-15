import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, User, ArrowRight, LayoutDashboard } from "lucide-react";
import useAuth from "../useAuth";
import { useAuthContext } from "@/context/AuthContext";

const RoleSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectRole } = useAuth();
    const { reloadContext } = useAuthContext();

    // Extract data from the previous navigation state
    const { tempUser, roles, tenantId } = location.state || {};
    const [loadingRoleId, setLoadingRoleId] = useState(null);

    // ✅ Guard: Use useEffect to handle navigation to avoid React lifecycle warnings
    useEffect(() => {
        if (!tempUser || !roles) {
            navigate("/login", { replace: true });
        }
    }, [tempUser, roles, navigate]);

    if (!tempUser || !roles) return null;

    const handleRoleSelect = async (roleId) => {
        try {
            setLoadingRoleId(roleId);

            const response = await selectRole({
                userId: tempUser.id,
                roleId: roleId,
                tenantId: tenantId,
            });

            // Based on your console log, the user object looks like this:
            const user = response?.data?.user || response?.user || response;

            // Load context immediately after selection!
            await reloadContext();

            // ✅ Updated Logic using the keys from your console log
            if (user?.isPlatformUser || user?.isSuperAdmin || user?.onboardingStatus === "COMPLETED") {
                // Platform admins and completed users go to the main dashboard
                navigate("/", { replace: true });
            } else {
                // Only actual tenants who haven't finished onboarding go here
                navigate("/onboarding/lab-profile", { replace: true });
            }
        } catch (error) {
            console.error("Role selection failed:", error);
        } finally {
            setLoadingRoleId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded shadow-xl p-8 border border-slate-100">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LayoutDashboard className="text-indigo-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Select Workspace</h2>
                    <p className="text-slate-500 mt-2">
                        Logged in as <span className="font-semibold text-slate-800">{tempUser.email}</span>
                    </p>
                </div>

                {/* Roles List */}
                <div className="space-y-4">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleRoleSelect(role.id)}
                            disabled={loadingRoleId !== null}
                            className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 group
                                ${loadingRoleId === role.id
                                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                                    : "border-slate-50 hover:border-indigo-200 hover:bg-slate-50 hover:shadow-md"}`}
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className={`p-3 rounded-lg transition-colors ${role.code?.includes('ADMIN')
                                    ? "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                    }`}>
                                    {role.code?.includes('ADMIN') ? <Shield size={22} /> : <User size={22} />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg leading-tight">
                                        {role.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
                                        {role.code}
                                    </p>
                                </div>
                            </div>

                            {loadingRoleId === role.id ? (
                                <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
                            ) : (
                                <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer / Exit */}
                <button
                    onClick={() => navigate("/login")}
                    className="w-full mt-10 text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium"
                >
                    Sign in with different account
                </button>
            </div>

            <p className="mt-8 text-slate-400 text-xs">
                &copy; 2026 iQLIMS System. Professional Edition.
            </p>
        </div>
    );
};

export default RoleSelection;