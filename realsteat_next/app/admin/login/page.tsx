"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("admin@admin.com");
    const [password, setPassword] = useState("admin123");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
            const res = await fetch(`${apiUrl}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save token to localStorage for client-side API requests
            localStorage.setItem("token", data.token);

            // Save token to cookie for Next.js middleware route protection (30 days)
            document.cookie = `admin_token=${data.token}; path=/; max-age=2592000; SameSite=Lax`;

            // Redirect to admin dashboard
            router.push("/admin");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

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
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Email Address</label>
                            <input
                                type="email"
                                placeholder="admin@presidentproperties.com"
                                className="w-full p-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-foreground"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="rounded border-border text-primary focus:ring-primary" />
                            <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me for 30 days</label>
                        </div>

                        <Button type="submit" size="lg" className="w-full h-12" disabled={isLoading}>
                            {isLoading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Secure portal for authorized personnel only.
                </p>
            </div>
        </div>
    );
}
