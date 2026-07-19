import React from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Zap, Target, BarChart3, MessageSquare } from 'lucide-react';

export default function LandingPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-accent selection:text-black pb-20">
      {/* Navigation */}
      <nav className="border-b-[3px] border-black bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary border-[3px] border-black p-1.5 shadow-neo">
            <Target className="w-6 h-6 text-black" strokeWidth={3} />
          </div>
          <span className="text-2xl font-black tracking-tight text-black">DiscoveryOS</span>
        </div>
        <Link href="/login">
          <button className="bg-accent hover:bg-[#ffe600] text-black border-[3px] border-black px-6 py-2.5 font-bold shadow-neo transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none">
            Try Demo
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
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
                  Try Demo Now <ArrowRight strokeWidth={3} />
                </button>
              </Link>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            {/* Abstract visual representing AI PM */}
            <div className="aspect-square bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-accent border-[3px] border-black p-2 shadow-neo animate-bounce">
                <Zap className="w-8 h-8 text-black" strokeWidth={3} />
              </div>
              <div className="absolute bottom-12 left-8 bg-secondary border-[3px] border-black p-3 shadow-neo rotate-6">
                <MessageSquare className="w-10 h-10 text-black" strokeWidth={3} />
              </div>
              <div className="h-full w-full border-[3px] border-black bg-gray-50 flex flex-col pt-12">
                <div className="flex-1 p-6 space-y-6 relative z-10">
                  <div className="w-3/4 h-8 bg-gray-200 border-[2px] border-black"></div>
                  <div className="w-1/2 h-8 bg-gray-200 border-[2px] border-black"></div>
                  <div className="flex gap-4 mt-8">
                    <div className="w-12 h-12 rounded-full bg-primary border-[3px] border-black flex-shrink-0 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-black" />
                    </div>
                    <div className="bg-white border-[3px] border-black p-4 shadow-neo flex-1">
                      <div className="w-full h-4 bg-gray-200 border-[2px] border-black mb-3"></div>
                      <div className="w-5/6 h-4 bg-gray-200 border-[2px] border-black"></div>
                    </div>
                  </div>
                </div>
                {/* Decorative background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32">
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
              <div key={i} className="bg-white border-[3px] border-black p-8 shadow-neo hover:-translate-y-2 transition-transform duration-300">
                <div className={`${feature.color} w-20 h-20 border-[3px] border-black flex items-center justify-center shadow-neo mb-6 -rotate-3`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-lg font-medium text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
