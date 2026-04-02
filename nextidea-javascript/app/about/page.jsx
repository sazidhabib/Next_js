"use client";



import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CTASection from "../components/CTASection";
import FAQSection from "../components/FAQSection";
import { Target, Lightbulb, Users, Award, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-zinc-900 text-white pt-24 pb-32 lg:pt-32 lg:pb-40">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[100px] opacity-50 -translate-x-1/2 translate-y-1/2" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-primary-light text-sm font-medium mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Who We Are
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
                Empowering your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-light">Digital Future</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                We are a passionate team of technologists, designers, and strategists dedicated to transforming ideas into impactful digital realities.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark transition-all rounded-full font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                  Start a Project
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#our-story" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 transition-all rounded-full font-semibold text-white backdrop-blur-md border border-white/10 flex items-center justify-center">
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section id="our-story" className="py-24 lg:py-32 relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group animate-slide-in-left">
                <Image 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Our Team Collaborating" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white">
                    <div className="text-3xl font-bold mb-2">10+</div>
                    <div className="text-zinc-200">Years of driving digital excellence</div>
                  </div>
                </div>
              </div>

              <div className="animate-fade-in-up delay-200">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-900">
                  Built on a foundation of <span className="text-primary">innovation</span>
                </h2>
                <div className="space-y-6 text-lg text-zinc-600">
                  <p>
                    Since our inception, NextIdea Solution has been driven by a singular mission: to bridge the gap between complex technology and tangible business success. We believe that every challenge is an opportunity to innovate.
                  </p>
                  <p>
                    What started as a small team of passionate developers has grown into a full-service digital agency. From robust enterprise software to captivating brand identities, we bring a wealth of expertise and a commitment to excellence to every project we touch.
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6 mt-10">
                  {[
                    "Client-Centric Approach",
                    "Agile Methodology",
                    "Award-Winning Designs",
                    "Scalable Architecture"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-zinc-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-24 bg-zinc-50 border-y border-zinc-100">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Mission */}
              <div className="bg-white p-10 rounded-3xl shadow-lg border border-zinc-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Target className="w-32 h-32" />
                </div>
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-900">Our Mission</h3>
                <p className="text-zinc-600 leading-relaxed text-lg">
                  To empower businesses with cutting-edge digital solutions that drive growth, enhance user experiences, and solve complex challenges with elegance and efficiency.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white p-10 rounded-3xl shadow-lg border border-zinc-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Lightbulb className="w-32 h-32" />
                </div>
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-900">Our Vision</h3>
                <p className="text-zinc-600 leading-relaxed text-lg">
                  To be the global benchmark for digital innovation, shaping the future of technology by delivering transformative experiences that leave a lasting impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 text-zinc-900">Our Core Values</h2>
              <p className="text-lg text-zinc-600">
                The principles that guide our decisions, shape our culture, and define the way we work together and with our partners.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Innovation First",
                  desc: "We constantly explore new technologies and creative approaches to stay ahead of the curve."
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Uncompromising Integrity",
                  desc: "Honesty and transparency are the bedrock of every relationship we build."
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: "Commitment to Excellence",
                  desc: "Good is never enough. We strive for perfection in every line of code and pixel we design."
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Collaborative Spirit",
                  desc: "We believe the best results come from working closely with our clients as a unified team."
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Results-Driven",
                  desc: "Our strategies are focused entirely on achieving measurable business outcomes."
                },
                {
                  icon: <Lightbulb className="w-6 h-6" />,
                  title: "Continuous Learning",
                  desc: "The digital world evolves rapidly, and so do we, through constant education and adaptation."
                }
              ].map((value, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} whileHover={{ y: -5 }} className="group p-8 rounded-3xl bg-white border border-zinc-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-colors duration-300 mb-6">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-zinc-900">{value.title}</h4>
                  <p className="text-zinc-600">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
