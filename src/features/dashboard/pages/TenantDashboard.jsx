import React from "react";
import {
    Users, FlaskConical, ClipboardCheck, Wallet,
    Info, ChevronRight, Activity, Clock, Beaker, Calendar
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";

// Mock data for Daily Appointments/Tests
const dailyTestsData = [
    { id: 1, patient: "Rahul Sharma", status: "Completed", test: "Complete Blood Count", type: "Routine", price: "₹450", time: "10:30 AM" },
    { id: 2, patient: "Ananya Iyer", status: "Processing", test: "Thyroid Profile", type: "Urgent", price: "₹1,200", time: "11:15 AM" },
    { id: 3, patient: "David Miller", status: "Pending", test: "Lipid Profile", type: "Routine", price: "₹800", time: "11:45 AM" },
    { id: 4, patient: "Sita Verma", status: "Completed", test: "HbA1c", type: "Follow-up", price: "₹600", time: "09:00 AM" },
];

const topDoctorsData = [
    { name: "Dr. Arvind (City Hospital)", count: 145 },
    { name: "Dr. Sarah (General Clinic)", count: 98 },
    { name: "Self-Referral", count: 76 },
    { name: "Dr. Kapoor (Specialty Care)", count: 54 },
    { name: "Dr. Reddy (Health First)", count: 42 },
];

const LabAdminDashboard = () => {
    // 1. Core Lab Metrics
    const stats = [
        {
            title: "Total Patients",
            value: "1,240",
            trend: "12% increase",
            icon: Users,
            color: "blue"
        },
        {
            title: "Tests Performed",
            value: "3,850",
            icon: FlaskConical,
            color: "green"
        },
        {
            title: "Pending Reports",
            value: "14",
            icon: Clock,
            color: "amber"
        },
        {
            title: "Daily Collection",
            value: "₹42,500",
            icon: Wallet,
            color: "red"
        },
    ];

    // 2. Table Configuration for Patient Flow
    const testColumns = [
        { header: "Patient Name", render: (row) => <span className="font-semibold text-gray-700">{row.patient}</span> },
        {
            header: "Status", render: (row) => (
                <Badge
                    text={row.status}
                    variant={row.status === "Completed" ? "success" : row.status === "Processing" ? "info" : "warning"}
                />
            )
        },
        { header: "Test Type", accessor: "test" },
        {
            header: "Priority", render: (row) => (
                <span className={row.type === "Urgent" ? "text-red-500 font-bold" : "text-gray-500"}>{row.type}</span>
            )
        },
        { header: "Amount", accessor: "price" },
        { header: "Time", accessor: "time" },
    ];

    return (
        <div className="space-y-6 min-h-screen">
            {/* --- TOP STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- TEST CATEGORY DISTRIBUTION --- */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-800 mb-6">Test Category Distribution</h4>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
                        <p className="text-gray-400 text-xs italic">Pie Chart (Pathology, Radiology, Hematology, Biochemistry)</p>
                    </div>
                </div>

                {/* --- LAB OPERATIONS HEALTH --- */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-bold text-gray-800">Operational Health</h4>
                        <select className="text-[10px] font-bold text-gray-500 bg-gray-50 border-none rounded-md px-2 py-1">
                            <option>Today</option>
                            <option>This Week</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <Beaker className="w-3 h-3 text-blue-500" />
                                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Reagent Stock</span>
                                </div>
                                <p className="text-xl font-bold text-gray-800">82%</p>
                                <p className="text-[10px] text-gray-400 font-bold">Stable</p>
                            </div>
                            <div className="bg-green-50/50 p-4 rounded-xl border border-green-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <Activity className="w-3 h-3 text-green-500" />
                                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Avg Turnaround</span>
                                </div>
                                <p className="text-xl font-bold text-gray-800">4.2 Hrs</p>
                                <p className="text-[10px] text-green-600 font-bold">↓ 12% faster</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-gray-50">
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Equipments</p>
                                <Badge text="All Functional" variant="success" className="w-full py-1.5 justify-center" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Staff Status</p>
                                <Badge text="Active" variant="success" className="w-full py-1.5 justify-center" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RECENT LAB ACTIVITY --- */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-bold text-gray-800">Recent Lab Alerts</h4>
                        <button className="text-blue-600 text-xs font-bold flex items-center hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                            Log <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                    <div className="space-y-5">
                        {[
                            { title: "Critical Value Alert", sub: "Patient: Rahul Sharma (Glucose High)", time: "5m ago", color: "bg-red-500" },
                            { title: "Report Authorized", sub: "By Dr. Smith (Thyroid Profile)", time: "15m ago", color: "bg-green-500" },
                            { title: "New Sample Received", sub: "Home Collection - Batch A", time: "22m ago", color: "bg-blue-600" },
                            { title: "Inventory Low", sub: "Vacutainer tubes (Purple top)", time: "1h ago", color: "bg-amber-500" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                <div className={`${item.color} p-2.5 rounded-lg text-white shadow-sm`}>
                                    <Info className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-800">{item.title}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- DAILY TEST SUMMARY TABLE --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Today's Appointment Queue</h4>
                    <DataTable columns={testColumns} data={dailyTestsData} />
                </div>

                {/* --- TOP REFERRING DOCTORS --- */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-bold text-gray-800">Top Referring Sources</h4>
                        <select className="text-[10px] font-bold text-gray-500 bg-gray-50 border-none rounded-md px-2 py-1"><option>This month</option></select>
                    </div>
                    <div className="space-y-6">
                        {topDoctorsData.map((doc, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold text-white 
                                        ${idx === 0 ? 'bg-blue-600' : 'bg-blue-400'}`}>
                                        {idx + 1}
                                    </span>
                                    <span className="text-xs font-bold text-gray-700 flex-1 truncate">{doc.name}</span>
                                    <span className="text-xs font-bold text-gray-900">{doc.count}</span>
                                </div>
                                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 bg-blue-500`}
                                        style={{ width: `${(doc.count / 150) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabAdminDashboard;