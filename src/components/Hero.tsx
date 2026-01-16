"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tv, Globe, Zap, Shield, Clock, Star } from "lucide-react";

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
                  <Clock className="h-4 w-4" />
                  <span>Instant Delivery</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                Premium 
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Firestick Setup
                </span>
                <br />
                & Digital Goods Marketplace
              </h1>

              {/* Subheading */}
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Transform your streaming experience with professional Firestick setup services. 
                Access premium digital goods, streaming apps, and entertainment solutions with 
                instant delivery across the UK, USA, Europe, Canada, and Australia.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Tv className="mr-3 h-5 w-5" />
                  Get Firestick Setup
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
                <Link
                  href="/digital-goods"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  <Zap className="mr-3 h-5 w-5" />
                  Browse Digital Goods
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
                    <span className="text-white/80 text-sm font-medium">Direct Vendor</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main Device Image */}
              <div className="relative mx-auto max-w-md lg:max-w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/firestick-hero-device.jpg"
                    alt="Amazon Firestick 4K Max with premium streaming apps installed - Professional setup service"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-gray-800">Live Setup</span>
                    </div>
                  </motion.div>
                </div>

                {/* App Icons Grid */}
                <div className="absolute -bottom-6 -right-6 grid grid-cols-2 gap-3">
                  {[
                    { name: 'Netflix', icon: '/images/netflix-icon.png', color: 'bg-red-600' },
                    { name: 'Disney+', icon: '/images/disney-icon.png', color: 'bg-blue-600' },
                    { name: 'Prime Video', icon: '/images/prime-icon.png', color: 'bg-blue-500' },
                    { name: 'Spotify', icon: '/images/spotify-icon.png', color: 'bg-green-600' }
                  ].map((app, index) => (
                    <motion.div
                      key={app.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`w-16 h-16 ${app.color} rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                      title={`${app.name} - Available with our setup`}
                    >
                      <Image
                        src={app.icon}
                        alt={`${app.name} streaming app icon`}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
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
