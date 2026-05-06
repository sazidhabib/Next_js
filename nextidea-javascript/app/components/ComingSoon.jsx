"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Hammer, Timer, Mail } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ComingSoon({ title, description }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-20">
        <section className="relative w-full py-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-sm font-medium mb-8"
              >
                <Hammer className="w-4 h-4 text-primary" />
                Under Construction
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 mb-6"
              >
                {title} <span className="text-primary">is Coming Soon</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-zinc-500 mb-10 leading-relaxed"
              >
                {description || "We're working hard to bring you something amazing. This page is currently under development and will be available shortly."}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link 
                  href="/contact" 
                  className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark transition-all rounded-full font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/" 
                  className="w-full sm:w-auto px-8 py-4 bg-zinc-100 hover:bg-zinc-200 transition-all rounded-full font-semibold text-zinc-900 flex items-center justify-center gap-2"
                >
                  Back to Home
                </Link>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50"
              >
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <Timer className="w-6 h-6" />
                  <span className="text-xs uppercase tracking-widest font-bold">Stay Tuned</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <Mail className="w-6 h-6" />
                  <span className="text-xs uppercase tracking-widest font-bold">Email Alerts</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <Hammer className="w-6 h-6" />
                  <span className="text-xs uppercase tracking-widest font-bold">Building</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <ArrowRight className="w-6 h-6" />
                  <span className="text-xs uppercase tracking-widest font-bold">Launch</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
