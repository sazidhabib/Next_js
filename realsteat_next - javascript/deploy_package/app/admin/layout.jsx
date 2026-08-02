"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Settings,
    LogOut,
    PlusCircle,
    Menu,
    MapPin,
    Award,
    FileText,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const handleLogout = () => {
        // Clear token from localStorage
        localStorage.removeItem("token");
        // Clear token from cookies
        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        // Redirect to login page
        window.location.href = "/admin/login";
    };

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-secondary/10 dark:bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r border-border flex-shrink-0 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <Link href="/admin" className="font-serif font-bold text-xl text-foreground">
                        ADMIN <span className="text-primary">PANEL</span>
                    </Link>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {(() => {
                        const getLinkClass = (path) => {
                            // Match exact path for "/admin" dashboard, prefix match for others
                            const isActive = path === "/admin" 
                                ? pathname === "/admin" 
                                : pathname === path || (pathname.startsWith(path) && pathname[path.length] === "/");
                            return isActive
                                ? "flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium transition-colors"
                                : "flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors";
                        };

                        return (
                            <>
                                <Link href="/admin" className={getLinkClass("/admin")}>
                                    <LayoutDashboard size={20} />
                                    Dashboard
                                </Link>
                                <Link href="/admin/projects" className={getLinkClass("/admin/projects")}>
                                    <Building2 size={20} />
                                    Projects
                                </Link>
                                <Link href="/admin/projects/new" className={getLinkClass("/admin/projects/new")}>
                                    <PlusCircle size={20} />
                                    Add Project
                                </Link>
                                <Link href="/admin/properties" className={getLinkClass("/admin/properties")}>
                                    <Building2 size={20} className="text-emerald-500" />
                                    Properties
                                </Link>
                                <Link href="/admin/properties/new" className={getLinkClass("/admin/properties/new")}>
                                    <PlusCircle size={20} className="text-emerald-500" />
                                    Add Property
                                </Link>
                                <Link href="/admin/categories" className={getLinkClass("/admin/categories")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" /></svg>
                                    Categories
                                </Link>
                                <Link href="/admin/locations" className={getLinkClass("/admin/locations")}>
                                    <MapPin size={20} className="text-amber-500" />
                                    Locations
                                </Link>
                                <Link href="/admin/amenities" className={getLinkClass("/admin/amenities")}>
                                    <Award size={20} className="text-purple-500" />
                                    Amenities
                                </Link>
                                <Link href="/admin/pages" className={getLinkClass("/admin/pages")}>
                                    <FileText size={20} className="text-blue-500" />
                                    Page Content
                                </Link>
                                <Link href="/admin/testimonials" className={getLinkClass("/admin/testimonials")}>
                                    <MessageSquare size={20} className="text-pink-500" />
                                    Testimonials
                                </Link>
                                <Link href="/admin/settings" className={getLinkClass("/admin/settings")}>
                                    <Settings size={20} />
                                    Settings
                                </Link>
                            </>
                        );
                    })()}
                </nav>

                <div className="p-4 border-t border-border">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content View */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:hidden">
                    <Link href="/admin" className="font-serif font-bold text-lg text-foreground">
                        ADMIN <span className="text-primary">PANEL</span>
                    </Link>
                    <Button variant="ghost" size="icon">
                        <Menu size={24} />
                    </Button>
                </header>

                {/* Topbar (Desktop) */}
                <header className="h-16 bg-background border-b border-border hidden md:flex items-center justify-between px-8">
                    <h2 className="text-lg font-medium text-foreground">Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                A
                            </div>
                            <span className="text-sm font-medium text-foreground">Admin User</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
