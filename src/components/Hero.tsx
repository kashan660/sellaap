"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Truck, Shield, Star, PawPrint, Sparkles, Cpu, Home, Car } from "lucide-react";

const NICHES = [
  { name: 'Pet Supplies', icon: PawPrint, gradient: 'from-amber-500 to-orange-600' },
  { name: 'Beauty', icon: Sparkles, gradient: 'from-pink-500 to-rose-600' },
  { name: 'Electronics', icon: Cpu, gradient: 'from-blue-500 to-indigo-600' },
  { name: 'Home Equipment', icon: Home, gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Vehicle Accessories', icon: Car, gradient: 'from-slate-500 to-slate-700' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 sm:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.1))] dark:bg-grid-black/5" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
          {/* Content Column */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white/90">
                  <Shield className="h-4 w-4" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white/90">
                  <Star className="h-4 w-4" />
                  <span>5-Star Rated Service</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white/90">
                  <Truck className="h-4 w-4" />
                  <span>Fast US Shipping</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                Everything You Need,
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}All In One Store
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Shop top-quality Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle
                Accessories - carefully sourced, competitively priced, and shipped fast across the USA.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  Shop Now
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
                <Link
                  href="#categories"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  Explore Categories
                </Link>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 items-center">
                <span className="text-white/60 text-sm">Secure payments with:</span>
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                    <Image src="/images/paypal-logo.svg" alt="PayPal" width={60} height={20} className="h-5 w-auto" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                    <Image src="/images/payoneer-logo.svg" alt="Payoneer" width={60} height={20} className="h-5 w-auto" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                    <span className="text-white/80 text-sm font-medium">& More</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Column - category mosaic */}
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-full grid grid-cols-2 gap-4">
                {NICHES.slice(0, 4).map((niche, index) => (
                  <motion.div
                    key={niche.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`bg-gradient-to-br ${niche.gradient} rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center gap-3 aspect-square border border-white/10`}
                  >
                    <niche.icon className="h-10 w-10 text-white" />
                    <span className="text-white font-semibold text-sm text-center">{niche.name}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={`mt-4 bg-gradient-to-br ${NICHES[4].gradient} rounded-2xl p-4 shadow-xl flex items-center justify-center gap-3 border border-white/10`}
              >
                <Car className="h-6 w-6 text-white" />
                <span className="text-white font-semibold text-sm">{NICHES[4].name}</span>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">2K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
