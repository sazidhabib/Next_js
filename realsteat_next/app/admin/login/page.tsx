import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminLogin() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 bg-primary/5"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block font-serif font-bold text-3xl text-foreground mb-4">
                        PRESIDENT <span className="text-primary italic">PROPERTIES</span>
                    </Link>
                    <p className="text-muted-foreground">Sign in to access the administrator panel.</p>
                </div>

                <div className="bg-card border border-border p-8 rounded-2xl shadow-xl">
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Email Address</label>
                            <input
                                type="email"
                                placeholder="admin@presidentproperties.com"
                                className="w-full p-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-foreground"
                                defaultValue="admin@admin.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <Link href="#" className="text-xs text-primary hover:underline">Forgot Password?</Link>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-foreground"
                                defaultValue="password123"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="rounded border-border text-primary focus:ring-primary" />
                            <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me for 30 days</label>
                        </div>

                        <Link href="/admin">
                            <Button type="button" size="lg" className="w-full h-12">Sign In</Button>
                        </Link>
                    </form>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Secure portal for authorized personnel only.
                </p>
            </div>
        </div>
    );
}
