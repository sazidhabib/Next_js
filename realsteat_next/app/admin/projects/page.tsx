import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Edit2, Trash2, MoreHorizontal } from "lucide-react";

// Mock Data
const mockProjects = [
    { id: "1", title: "The Oasis Residences", location: "Gulshan, Dhaka", status: "Ongoing", price: "$1,200,000" },
    { id: "2", title: "Azure Commercial Skyline", location: "Banani, Dhaka", status: "Ready", price: "Contact for Details" },
    { id: "3", title: "Crescent Lake Villas", location: "Bashundhara R/A", status: "Sold Out", price: "$3,500,000" },
    { id: "4", title: "Pinnacle Business Center", location: "Motijheel, Dhaka", status: "Upcoming", price: "Contact for Details" },
    { id: "5", title: "Serenity Heights", location: "Uttara, Dhaka", status: "Ongoing", price: "$850,000" },
];

export default function ProjectsList() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage all your real estate projects from here.</p>
                </div>
                <Link href="/admin/projects/new" className="flex items-center gap-2">
                    <Button>
                        <Plus size={18} />
                        Add New Project
                    </Button>
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border flex items-center gap-4 bg-background/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects by title or location..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                    </div>
                    <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-foreground cursor-pointer">
                        <option value="">All Statuses</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="ready">Ready</option>
                        <option value="sold">Sold Out</option>
                        <option value="upcoming">Upcoming</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/30 text-muted-foreground text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium border-b border-border">Title</th>
                                <th className="px-6 py-4 font-medium border-b border-border">Location</th>
                                <th className="px-6 py-4 font-medium border-b border-border">Price</th>
                                <th className="px-6 py-4 font-medium border-b border-border">Status</th>
                                <th className="px-6 py-4 font-medium border-b border-border text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {mockProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-secondary/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">{project.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1 text-primary">ID: {project.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{project.location}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{project.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${project.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                      ${project.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
                      ${project.status === 'Sold Out' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : ''}
                      ${project.status === 'Upcoming' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                    `}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                <Trash2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination mock */}
                <div className="p-4 border-t border-border flex items-center justify-between bg-background/50 text-sm text-muted-foreground">
                    <span>Showing 1 to 5 of 24 results</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
