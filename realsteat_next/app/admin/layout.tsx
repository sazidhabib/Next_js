import Link from "next/link";
import {
    LayoutDashboard,
    Building2,
    Settings,
    LogOut,
    PlusCircle,
    Menu
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium transition-colors">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
                        <Building2 size={20} />
                        Projects
                    </Link>
                    <Link href="/admin/projects/new" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
                        <PlusCircle size={20} />
                        Add Project
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" /></svg>
                        Categories
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
                        <Settings size={20} />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-border">
                    <Link href="/admin/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
                        <LogOut size={20} />
                        Logout
                    </Link>
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
