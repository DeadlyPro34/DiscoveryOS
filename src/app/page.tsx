'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Zap, Target, BarChart3, MessageSquare } from 'lucide-react';

export default function LandingPage(): React.ReactElement {
  return (
    <div 
      className="min-h-screen bg-[#c8f0e0] font-sans selection:bg-accent selection:text-black"
      style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
    >
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-40 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-block bg-secondary border-[3px] border-black px-4 py-2 font-bold shadow-neo -rotate-2">
              Not just a chatbot 🤖
            </div>
            <h1 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-black">
              Meet your <br />
              <span className="bg-primary px-2 border-[3px] border-black inline-block shadow-neo mt-2">AI Product</span><br />
              Manager
            </h1>
            <p className="text-xl md:text-2xl font-bold text-gray-800 border-l-[6px] border-accent pl-6 py-2">
              Transform messy customer feedback into evidence-backed product decisions in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-800 border-[3px] border-black px-8 py-4 text-xl font-black shadow-neo transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none">
                  Sign In <ArrowRight strokeWidth={3} />
                </button>
              </Link>
              <Link href="/login?tab=signup">
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 border-[3px] border-black px-8 py-4 text-xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-none">
                  Sign Up
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="aspect-square bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative">
              
              {/* Document Background Grid */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* Main Document Content */}
              <div className="w-full h-full border-[3px] border-black p-6 bg-white relative z-10 flex flex-col gap-6">
                
                {/* Title Lines */}
                <div className="w-3/4 h-8 bg-gray-200 border-[2px] border-black"></div>
                <div className="w-1/2 h-8 bg-gray-200 border-[2px] border-black"></div>

                {/* Insight Block */}
                <div className="mt-8 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[#4DD9AC] border-[3px] border-black flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-3">
                    <div className="w-full h-4 bg-gray-200 border-[2px] border-black"></div>
                    <div className="w-4/5 h-4 bg-gray-200 border-[2px] border-black"></div>
                  </div>
                </div>

              </div>

              {/* Top Right Yellow Zap Post-it */}
              <div className="absolute top-2 right-2 w-16 h-16 bg-[#FFE066] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 flex items-center justify-center rotate-3">
                <Zap className="w-8 h-8 text-black fill-black" />
              </div>

              {/* Bottom Left Pink Message Post-it */}
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: -6 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.8 }}
                className="absolute bottom-4 left-4 w-20 h-20 bg-[#FF80BF] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 flex items-center justify-center"
              >
                <MessageSquare className="w-10 h-10 text-black fill-transparent stroke-[3]" />
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-32"
        >
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-black">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="w-10 h-10" />,
                title: '1. Connect Data',
                desc: 'Upload user interviews, support tickets, and sales calls.',
                color: 'bg-secondary'
              },
              {
                icon: <Brain className="w-10 h-10" />,
                title: '2. AI Analysis',
                desc: 'Our AI Product Manager synthesizes themes and pain points.',
                color: 'bg-accent'
              },
              {
                icon: <BarChart3 className="w-10 h-10" />,
                title: '3. Get Evidence',
                desc: 'Make roadmap decisions backed by actual customer data.',
                color: 'bg-primary'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white border-[3px] border-black p-8 shadow-neo hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={`${feature.color} w-20 h-20 border-[3px] border-black flex items-center justify-center shadow-neo mb-6 -rotate-3`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-lg font-medium text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
