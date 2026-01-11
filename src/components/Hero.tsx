"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Tv, Globe, Zap } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background py-16 sm:py-24">
      <div className="relative">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
          <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <span className="h-12 w-12 rounded-md flex items-center justify-center bg-primary shadow-lg">
                  <Tv className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                  Unlock the Ultimate <span className="text-primary">Entertainment</span> Experience
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Premium Firestick setup services tailored for the UK, USA, and Europe. 
                  Experience seamless streaming and access to unlimited digital goods instantly.
                </p>
                <div className="mt-6 flex gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-all"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 border border-input text-base font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    Read Our Blog
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
               <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="w-full h-full min-h-[400px] bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden border border-border/50"
               >
                  <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-black/10" />
                  
                  {/* Abstract Visual Representation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                     <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-card p-6 rounded-xl shadow-xl flex flex-col items-center border border-border"
                     >
                        <Globe className="h-12 w-12 text-blue-500 mb-3" />
                        <span className="font-bold text-lg">Global Coverage</span>
                        <span className="text-sm text-muted-foreground text-center">Optimized for UK, USA & Europe</span>
                     </motion.div>
                     <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-card p-6 rounded-xl shadow-xl flex flex-col items-center border border-border mt-0 sm:mt-12"
                     >
                        <Zap className="h-12 w-12 text-yellow-500 mb-3" />
                        <span className="font-bold text-lg">Instant Setup</span>
                        <span className="text-sm text-muted-foreground text-center">Plug & Play Configuration</span>
                     </motion.div>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
