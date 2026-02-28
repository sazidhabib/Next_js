import { Building2, Users, Eye, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Mock Data
const stats = [
    { label: "Total Projects", value: "24", icon: Building2, trend: "+12%" },
    { label: "Active Listings", value: "18", icon: Eye, trend: "+5%" },
    { label: "Total Inquiries", value: "892", icon: Users, trend: "+24%" },
    { label: "Revenue Est.", value: "$12.5M", icon: TrendingUp, trend: "+18%" },
];

const recentActivities = [
    { id: 1, action: "New Inquiry", project: "The Oasis Residences", time: "2 hours ago", icon: Users },
    { id: 2, action: "Project Updated", project: "Azure Commercial Skyline", time: "5 hours ago", icon: Clock },
    { id: 3, action: "Project Sold Out", project: "Crescent Lake Villas", time: "1 day ago", icon: CheckCircle2 },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">Welcome back! Here is what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-card border border-border p-6 rounded-xl flex items-start justify-between shadow-sm">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                                <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
                                    <TrendingUp size={12} /> {stat.trend} from last month
                                </p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Icon className="text-primary" size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions & Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>
                            <Link href="/admin/projects">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: "The Oasis Residences", location: "Gulshan, Dhaka", status: "Ongoing", price: "$1.2M" },
                                { name: "Azure Commercial", location: "Banani, Dhaka", status: "Ready", price: "$2.5M" },
                                { name: "Crescent Villas", location: "Bashundhara R/A", status: "Sold Out", price: "$3.1M" }
                            ].map((project, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50 hover:bg-secondary/20 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-foreground">{project.name}</h4>
                                        <p className="text-sm text-muted-foreground">{project.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-foreground">{project.price}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500' :
                                                project.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    'bg-rose-500/10 text-rose-500'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full">
                        <h2 className="text-xl font-bold text-foreground mb-6">Recent Activity</h2>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                            {recentActivities.map((activity, idx) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary z-10">
                                            <Icon size={16} />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border bg-card shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-foreground text-sm">{activity.action}</div>
                                                <time className="font-caveat font-medium text-xs text-primary">{activity.time}</time>
                                            </div>
                                            <div className="text-slate-500 text-sm">
                                                {activity.project}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
