import React from 'react';
import { ArrowRight, Users, Briefcase, Target } from 'lucide-react';

function Getintouch() {
  const handleGetInTouch = () => {
    // Replace this with your routing logic
    // For React Router: navigate('/contact')
    // For Next.js: router.push('/contact')
    console.log('Navigating to contact page...');
    
    // Example with window.location (basic routing)
    window.location.href = '/contact';
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-24 px-6 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-blue-300/20 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 border border-slate-300/20 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 text-blue-300 text-sm font-medium">
                <Briefcase className="w-4 h-4 mr-2" />
                Professional Staffing Solutions
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Transform Your Business with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Strategic Staffing
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                Partner with industry experts to build high-performing teams that drive growth, innovation, and sustainable success for your organization.
              </p>
            </div>

            {/* Key Points */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Expert Talent</h3>
                  <p className="text-sm text-slate-400">Vetted professionals</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Targeted Solutions</h3>
                  <p className="text-sm text-slate-400">Custom approach</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Proven Results</h3>
                  <p className="text-sm text-slate-400">Track record</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleGetInTouch}
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 flex items-center justify-center space-x-2"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* <button className="border-2 border-slate-600 hover:border-slate-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-slate-800/50 focus:outline-none focus:ring-4 focus:ring-slate-300/50">
                Learn More
              </button> */}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">17</div>
                  <div className="text-sm text-slate-300">Companies Served</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">98%</div>
                  <div className="text-sm text-slate-300">Success Rate</div>
                </div>
              </div>

              {/* Process Steps */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-6">Our Process</h3>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-white">Consultation</h4>
                    <p className="text-sm text-slate-400">Understand your needs</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-white">Matching</h4>
                    <p className="text-sm text-slate-400">Find perfect candidates</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-white">Integration</h4>
                    <p className="text-sm text-slate-400">Seamless onboarding</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl rotate-12"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-xl -rotate-12"></div>
          </div>
        </div>

        {/* Bottom section - Trust indicators */}
        <div className="mt-20 pt-12 border-t border-slate-700/50">
          <div className="text-center mb-8">
            <p className="text-slate-400 font-medium">Trusted by leading companies worldwide</p>
          </div>
          
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="w-24 h-8 bg-slate-600/30 rounded"></div>
            <div className="w-32 h-8 bg-slate-600/30 rounded"></div>
            <div className="w-28 h-8 bg-slate-600/30 rounded"></div>
            <div className="w-20 h-8 bg-slate-600/30 rounded"></div>
            <div className="w-36 h-8 bg-slate-600/30 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Getintouch;