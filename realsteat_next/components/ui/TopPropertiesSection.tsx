import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Move, ArrowRight } from "lucide-react";

export function TopPropertiesSection() {
    return (
        <section className="py-24 bg-background relative border-t border-border/50">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">
                            TOP PROPERTIES
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
                            Best Property Value
                        </h2>
                    </div>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-primary font-semibold uppercase tracking-widest hover:text-foreground transition-colors duration-300"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Featured Property (Left) */}
                    <div className="lg:col-span-7 bg-white shadow-sm border border-slate-100 overflow-hidden flex flex-col group cursor-pointer transition-shadow hover:shadow-md">
                        <div className="relative h-[400px] w-full overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
                                alt="Amberwood Apartments"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                                <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-1">
                                    Featured
                                </span>
                                <span className="bg-[#e13b3b] text-white text-[10px] uppercase font-bold px-2 py-1">
                                    Renting
                                </span>
                            </div>
                            <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/40 backdrop-blur-sm  flex items-center justify-center text-white hover:bg-[#e13b3b] transition-colors">
                                <Heart className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-4 left-4 z-10">
                                <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5">
                                    Apartment
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">Amberwood Apartments</h3>
                            <span className="flex items-center text-slate-500 text-sm mb-4">
                                <MapPin size={16} className="text-primary mr-1" /> Copenhagen, Denmark
                            </span>
                            <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                                Ut et sit rerum qui quo. Qui voluptatem optio unde illo est vero. Quia quasi neque et dolor veritati...
                            </p>

                            <div className="flex items-center gap-6 text-slate-600 text-sm font-medium border-t border-slate-100 pt-6 mt-auto">
                                <div className="flex items-center gap-2">
                                    <Bed className="w-5 h-5 text-slate-400" />
                                    <span>4</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bath className="w-5 h-5 text-slate-400" />
                                    <span>5</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Move className="w-5 h-5 text-slate-400" />
                                    <span>850 m²</span>
                                </div>
                                <div className="ml-auto text-xl font-bold text-slate-900">
                                    $509,300
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* List Properties (Right) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* List Item 1 */}
                        <div className="bg-white shadow-sm border border-slate-100 p-3 flex flex-col sm:flex-row gap-4 group cursor-pointer hover:shadow-md transition-shadow">
                            <div className="relative w-full sm:w-[160px] h-[160px]  overflow-hidden shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=400&q=80"
                                    alt="Golden Gate Residences"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                    <span className="bg-emerald-500 text-white text-[9px] uppercase font-bold px-1.5 py-0.5  w-fit">Featured</span>
                                    <span className="bg-[#e13b3b] text-white text-[9px] uppercase font-bold px-1.5 py-0.5  w-fit">Renting</span>
                                </div>
                                <button className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded flex items-center justify-center text-white hover:bg-[#e13b3b] transition-colors z-10">
                                    <Heart className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-2 left-2 z-10">
                                    <span className="bg-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm">Apartment</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                    <h4 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">Golden Gate Residences</h4>
                                    <p className="flex items-center text-slate-400 text-xs mb-3">
                                        <MapPin size={13} className="text-primary mr-1" /> Munich, Bavaria
                                    </p>
                                    <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
                                        <div className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> 3</div>
                                        <div className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> 1</div>
                                        <div className="flex items-center gap-1.5"><Move className="w-4 h-4" /> 560 m²</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative">
                                            <Image src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Agent" fill sizes="40px" className="object-cover" />
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">Robyn Schultz</span>
                                    </div>
                                    <span className="font-bold text-slate-900">$445,700</span>
                                </div>
                            </div>
                        </div>

                        {/* List Item 2 */}
                        <div className="bg-white shadow-sm border border-slate-100 p-3 flex flex-col sm:flex-row gap-4 group cursor-pointer hover:shadow-md transition-shadow">
                            <div className="relative w-full sm:w-[160px] h-[160px]  overflow-hidden shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
                                    alt="Horizon Pointe"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                    <span className="bg-emerald-500 text-white text-[9px] uppercase font-bold px-1.5 py-0.5  w-fit">Featured</span>
                                    <span className="bg-[#e13b3b] text-white text-[9px] uppercase font-bold px-1.5 py-0.5  w-fit">Renting</span>
                                </div>
                                <button className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded flex items-center justify-center text-white hover:bg-[#e13b3b] transition-colors z-10">
                                    <Heart className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-2 left-2 z-10">
                                    <span className="bg-white text-slate-800 text-[10px] font-bold px-2 py-1 ">Apartment</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                    <h4 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">Horizon Pointe</h4>
                                    <p className="flex items-center text-slate-400 text-xs mb-3">
                                        <MapPin size={13} className="text-primary mr-1" /> Paris, France
                                    </p>
                                    <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
                                        <div className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> 9</div>
                                        <div className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> 2</div>
                                        <div className="flex items-center gap-1.5"><Move className="w-4 h-4" /> 960 m²</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative">
                                            <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" alt="Agent" fill sizes="40px" className="object-cover" />
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">Amara Wisozk</span>
                                    </div>
                                    <span className="font-bold text-slate-900">$162,500</span>
                                </div>
                            </div>
                        </div>

                        {/* List Item 3 */}
                        <div className="bg-white shadow-sm border border-slate-100 p-3 flex flex-col sm:flex-row gap-4 group cursor-pointer hover:shadow-md transition-shadow">
                            <div className="relative w-full sm:w-[160px] h-[160px]  overflow-hidden shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80"
                                    alt="Timberline Estates"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                    <span className="bg-emerald-500 text-white text-[9px] uppercase font-bold px-1.5 py-0.5  w-fit">Featured</span>
                                    <span className="bg-[#e13b3b] text-white text-[9px] uppercase font-bold px-1.5 py-0.5  w-fit">Selling</span>
                                </div>
                                <button className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded flex items-center justify-center text-white hover:bg-[#e13b3b] transition-colors z-10">
                                    <Heart className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-2 left-2 z-10">
                                    <span className="bg-white text-slate-800 text-[10px] font-bold px-2 py-1 shadow-sm">House</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                    <h4 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">Timberline Estates</h4>
                                    <p className="flex items-center text-slate-400 text-xs mb-3">
                                        <MapPin size={13} className="text-primary mr-1" /> Munich, Bavaria
                                    </p>
                                    <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
                                        <div className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> 2</div>
                                        <div className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> 5</div>
                                        <div className="flex items-center gap-1.5"><Move className="w-4 h-4" /> 940 m²</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative">
                                            <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Agent" fill sizes="40px" className="object-cover" />
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">Amara Wisozk</span>
                                    </div>
                                    <span className="font-bold text-slate-900">$280,000</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
