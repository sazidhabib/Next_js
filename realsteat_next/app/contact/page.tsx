import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="pt-24 pb-20 min-h-screen bg-background">
            {/* Header */}
            <section className="bg-background py-20 border-b border-border text-center">
                <div className="container mx-auto px-6 lg:px-12">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Get In Touch</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6">Contact Us</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Our expert property consultants are ready to assist you in finding your next luxury residence or commercial space.
                    </p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Contact Information */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-serif text-foreground mb-8">Corporate Head Office</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <MapPin className="text-primary mt-1 shrink-0" size={24} />
                                        <div>
                                            <h4 className="text-foreground font-medium mb-1">Address</h4>
                                            <p className="text-muted-foreground">Level 10, Premium Tower<br />123 Luxury Avenue, Business District<br />Dhaka 1212, Bangladesh</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <Phone className="text-primary mt-1 shrink-0" size={24} />
                                        <div>
                                            <h4 className="text-foreground font-medium mb-1">Phone</h4>
                                            <p className="text-muted-foreground">+880 2 1234567-8<br />+880 171 2345678 (Hotline)</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <Mail className="text-primary mt-1 shrink-0" size={24} />
                                        <div>
                                            <h4 className="text-foreground font-medium mb-1">Email</h4>
                                            <p className="text-muted-foreground">info@estatepro.com<br />sales@estatepro.com</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <Clock className="text-primary mt-1 shrink-0" size={24} />
                                        <div>
                                            <h4 className="text-foreground font-medium mb-1">Business Hours</h4>
                                            <p className="text-muted-foreground">Sunday - Thursday: 10:00 AM - 6:00 PM<br />Friday & Saturday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div>
                                <h3 className="text-xl font-serif text-foreground mb-4">Location Map</h3>
                                <div className="w-full h-[300px] bg-secondary/20 border border-border flex items-center justify-center text-muted-foreground text-sm">
                                    Google Maps Location Embed
                                </div>
                            </div>
                        </div>

                        {/* Inquiry Form */}
                        <div className="bg-card border border-border p-8 md:p-12 h-fit">
                            <h2 className="text-3xl font-serif text-foreground mb-2">Send an Inquiry</h2>
                            <p className="text-muted-foreground mb-8">
                                Fill out the form below and we will contact you as soon as possible.
                            </p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">First Name</label>
                                        <input type="text" className="w-full bg-background border border-border p-4 text-foreground focus:outline-none focus:border-primary transition-colors" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">Last Name</label>
                                        <input type="text" className="w-full bg-background border border-border p-4 text-foreground focus:outline-none focus:border-primary transition-colors" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                                        <input type="email" className="w-full bg-background border border-border p-4 text-foreground focus:outline-none focus:border-primary transition-colors" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                                        <input type="tel" className="w-full bg-background border border-border p-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Interest</label>
                                    <select className="w-full bg-background border border-border p-4 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none">
                                        <option value="">Select an option</option>
                                        <option value="residential">Residential Properties</option>
                                        <option value="commercial">Commercial Spaces</option>
                                        <option value="land">Land Development</option>
                                        <option value="other">General Inquiry</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Your Message</label>
                                    <textarea rows={5} className="w-full bg-background border border-border p-4 text-foreground focus:outline-none focus:border-primary transition-colors resize-none" required></textarea>
                                </div>

                                <Button size="lg" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
