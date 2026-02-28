"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="bg-background text-foreground pt-20 pb-10 border-t border-border">
            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                {/* Brand Column */}
                <div className="space-y-6">
                    <Link href="/" className="text-3xl font-serif font-bold tracking-widest text-primary inline-block">
                        ESTATE<span className="text-foreground">PRO</span>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Crafting luxury living spaces and commercial hubs that stand the test of time.
                        Experience unparalleled elegance and quality with every project.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-secondary dark:bg-white/5 hover:bg-primary hover:text-black dark:hover:text-black transition-colors rounded-full text-foreground">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="p-2 bg-secondary dark:bg-white/5 hover:bg-primary hover:text-black dark:hover:text-black transition-colors rounded-full text-foreground">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="p-2 bg-secondary dark:bg-white/5 hover:bg-primary hover:text-black dark:hover:text-black transition-colors rounded-full text-foreground">
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className="p-2 bg-secondary dark:bg-white/5 hover:bg-primary hover:text-black dark:hover:text-black transition-colors rounded-full text-foreground">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-serif font-semibold mb-6 text-foreground uppercase tracking-wider">Quick Links</h4>
                    <ul className="space-y-4">
                        <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link></li>
                        <li><Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors text-sm">Our Projects</Link></li>
                        <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
                        <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Careers</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-serif font-semibold mb-6 text-foreground uppercase tracking-wider">Contact Us</h4>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <MapPin className="text-primary mt-1 shrink-0" size={18} />
                            <span className="text-muted-foreground text-sm">123 Luxury Avenue, Premium District, City name, Country</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="text-primary shrink-0" size={18} />
                            <span className="text-muted-foreground text-sm">+1 (800) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="text-primary shrink-0" size={18} />
                            <span className="text-muted-foreground text-sm">inquiries@estatepro.com</span>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-lg font-serif font-semibold mb-6 text-foreground uppercase tracking-wider">Newsletter</h4>
                    <p className="text-muted-foreground text-sm mb-4">
                        Subscribe to our newsletter to receive the latest updates on our upcoming properties.
                    </p>
                    <form className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="bg-secondary dark:bg-white/5 border border-border dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground transition-colors"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-primary text-black font-semibold py-3 px-4 text-sm uppercase tracking-widest hover:bg-foreground hover:text-white transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-muted-foreground text-xs">
                    &copy; {new Date().getFullYear()} EstatePro Real Estate. All rights reserved.
                </p>
                <div className="flex gap-6">
                    <Link href="#" className="text-muted-foreground hover:text-foreground dark:hover:text-white text-xs transition-colors">Privacy Policy</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground dark:hover:text-white text-xs transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
