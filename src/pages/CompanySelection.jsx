import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';

function CompanySelection() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();

  const companies = [
    {
      id: 'annapurna-veneer',
      name: 'Annapurna Veneer',
      description: 'Premium Plywood & Veneer Supplier',
      logo: '🏢',
      color: 'from-teal-600 to-emerald-600'
    },
    {
      id: 'sagun-veneer',
      name: 'Sagun Veneer',
      description: 'Quality Veneer Solutions',
      logo: '🏭',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'shyam-veneer',
      name: 'Shyam Veneer',
      description: 'Trusted Veneer Products',
      logo: '🏪',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'shakti-ply',
      name: 'Shakti Ply',
      description: 'Premium Plywood Supplier',
      logo: '🏬',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'krishna-ply',
      name: 'Krishna Ply',
      description: 'Quality Plywood Products',
      logo: '🏛️',
      color: 'from-green-600 to-teal-600'
    }
  ];

  const handleCompanySelect = (company) => {
    console.log('🏢 Selecting company:', company.name, company.id);
    
    // Clear all previous data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('lastActivity');
    
    // Set new company using context
    selectCompany(company);
    
    // Navigate to login (no reload needed)
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="max-w-7xl w-full relative z-10">
        {/* Header with animated gradient text */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block">
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 mb-2 drop-shadow-2xl animate-gradient">
                Select Your Company
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-cyan-100 font-medium max-w-2xl mx-auto">
            Choose your business to access its comprehensive management system
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-300 text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Secure & Isolated Data | Multi-Company Management
          </div>
        </div>

        {/* Company Cards Grid with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company, index) => (
            <div
              key={company.id}
              onClick={() => handleCompanySelect(company)}
              className="group relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-teal-500/50 transform hover:-translate-y-3 transition-all duration-500 cursor-pointer border border-white/20 hover:border-teal-400/50 overflow-hidden"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${company.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>

              {/* Card Header with enhanced gradient */}
              <div className={`relative bg-gradient-to-br ${company.color} p-8 text-center transform group-hover:scale-105 transition-transform duration-500`}>
                <div className="text-7xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 filter drop-shadow-2xl">
                  {company.logo}
                </div>
                <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg tracking-tight">
                  {company.name}
                </h2>
                <div className="w-16 h-1 bg-white/50 mx-auto rounded-full transform group-hover:w-24 transition-all duration-500"></div>
              </div>

              {/* Card Body with enhanced content */}
              <div className="relative p-8 space-y-6">
                <p className="text-gray-200 text-center text-lg font-medium leading-relaxed">
                  {company.description}
                </p>
                
                {/* Features list */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-teal-300 text-sm">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Complete Data Isolation</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300 text-sm">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Real-time Analytics</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 rounded-xl hover:from-teal-600 hover:to-emerald-600 transform group-hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-teal-500/50 relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Access System
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10 rotate-45 bg-gradient-to-br from-white/20 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Footer with enhanced styling */}
        <div className="text-center mt-16 space-y-4">
          <div className="flex items-center justify-center gap-8 text-cyan-300/80 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Secure Access</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              <span>Comprehensive Reports</span>
            </div>
          </div>
          <p className="text-emerald-300/60 text-sm font-medium">
            © 2025 Multi-Company Management System | Created By Nitesh Raj
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default CompanySelection;
