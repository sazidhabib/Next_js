import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="pt-24 pb-20 min-h-screen bg-background">
            {/* Header */}
            <section className="bg-background py-20 border-b border-border flex items-center justify-center text-center relative overflow-hidden h-[40vh]">
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Corporate"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative z-10 px-6">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Corporate Profile</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">About EstatePro</h1>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
                            A Legacy Built on Trust, Quality, and Perfection.
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                            Founded in 1995, EstatePro embarked on a journey to redefine the real estate landscape. From our humble beginnings to becoming a leading property developer, our sole focus has been on delivering uncompromised quality and bringing architectural visions to life.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            We don&apos;t just build structures; we build communities. Every project is meticulously planned to ensure sustainability, aesthetic brilliance, and maximum return on investment for our clients.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative h-64 w-full">
                            <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Work 1" fill className="object-cover" />
                        </div>
                        <div className="relative h-64 w-full translate-y-8">
                            <Image src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Work 2" fill className="object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 bg-card border-y border-white/5">
                <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
                    <h2 className="text-3xl font-serif text-foreground mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="text-xl text-primary font-semibold mb-4 uppercase tracking-widest">Innovation</h3>
                            <p className="text-muted-foreground">Embracing the latest technologies and design trends to craft modern living spaces.</p>
                        </div>
                        <div>
                            <h3 className="text-xl text-primary font-semibold mb-4 uppercase tracking-widest">Integrity</h3>
                            <p className="text-muted-foreground">Operating with complete transparency and honesty in all our dealings.</p>
                        </div>
                        <div>
                            <h3 className="text-xl text-primary font-semibold mb-4 uppercase tracking-widest">Excellence</h3>
                            <p className="text-muted-foreground">Pursuing perfection in every detail, from foundation to the final finish.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    <h2 className="text-3xl font-serif text-foreground mb-16 text-center">Leadership Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { role: "Chairman", name: "Ahmed Rahman" },
                            { role: "Managing Director", name: "Tariq Hasan" },
                            { role: "Director of Architecture", name: "Sarah Khan" }
                        ].map((leader, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                                    <div className="absolute inset-0 bg-border"></div> {/* Placeholder for image */}
                                </div>
                                <h4 className="text-xl text-foreground font-medium mb-1">{leader.name}</h4>
                                <p className="text-primary text-sm uppercase tracking-widest">{leader.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
