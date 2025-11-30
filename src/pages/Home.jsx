import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('current');

  // Current business offerings
  const currentServices = [
    {
      title: 'Premium Plywood Manufacturing',
      description: 'ISI certified raw plywood materials with superior strength and durability',
      icon: '🪵',
      status: 'Available Now'
    },
    {
      title: 'Quality Veneer Supply',
      description: 'Wide range of decorative and structural veneer materials',
      icon: '🎨',
      status: 'Available Now'
    },
    {
      title: 'Block Board Production',
      description: 'High-grade block boards for construction and furniture base',
      icon: '🧱',
      status: 'Available Now'
    },
    {
      title: 'Raw Material Trading',
      description: 'Wholesale supply of wood raw materials to manufacturers',
      icon: '📦',
      status: 'Available Now'
    },
  ];

  // Future expansion plans
  const futureServices = [
    {
      title: 'Complete Furniture Solutions',
      description: 'Ready-to-use furniture including beds, wardrobes, and dining sets',
      icon: '🛏️',
      status: 'Coming Soon',
      eta: 'Q2 2026'
    },
    {
      title: 'Custom Wood Design Studio',
      description: 'Bespoke furniture design and manufacturing services',
      icon: '🎨',
      status: 'Coming Soon', 
      eta: 'Q3 2026'
    },
    {
      title: 'Home Interior Solutions',
      description: 'Complete home interior design and installation services',
      icon: '🏠',
      status: 'Coming Soon',
      eta: 'Q4 2026'
    },
    {
      title: 'Modular Kitchen Systems',
      description: 'Modern modular kitchen design and installation',
      icon: '🍳',
      status: 'Coming Soon',
      eta: 'Q1 2027'
    },
  ];

  const currentProducts = [
    {
      name: 'Marine Grade Plywood',
      description: 'Waterproof BWR/BWP grade plywood for marine and outdoor use',
      price: 'Starting from ₹120/sq.ft',
      image: '🌊',
      category: 'Raw Material'
    },
    {
      name: 'Commercial Plywood',
      description: 'High-grade MR plywood for furniture and interior applications',
      price: 'Starting from ₹85/sq.ft',
      image: '🏢',
      category: 'Raw Material'
    },
    {
      name: 'Decorative Veneer',
      description: 'Premium wood veneers in teak, mahogany, and oak finishes',
      price: 'Starting from ₹150/sq.ft',
      image: '✨',
      category: 'Raw Material'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="mb-6 animate-fade-in">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-900 px-6 py-2 rounded-full text-sm font-bold shadow-2xl border-2 border-yellow-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                ISO Certified | Trusted by 500+ Clients
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl tracking-tight">
              <span className="block">Annapurna Veneer</span>
              <span className="block text-3xl md:text-4xl mt-2 text-yellow-300 font-bold">Premium Plywood Excellence</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-3 text-cyan-100 font-semibold max-w-3xl mx-auto leading-relaxed">
              Leading Supplier of Premium Quality Plywood & Veneer
            </p>
            <p className="text-lg md:text-xl mb-10 text-emerald-200 max-w-2xl mx-auto">
              Your trusted partner for superior wood materials and future furniture solutions
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-bold text-lg">Fast Delivery</div>
                <div className="text-sm text-cyan-200">On-time guaranteed</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
                <div className="text-3xl mb-2">✓</div>
                <div className="font-bold text-lg">Quality Assured</div>
                <div className="text-sm text-cyan-200">ISI certified materials</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-bold text-lg">Best Prices</div>
                <div className="text-sm text-cyan-200">Competitive wholesale rates</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/buy"
                className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-900 px-10 py-5 rounded-xl font-bold shadow-2xl hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <svg className="w-6 h-6 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
                Get Quote Now
              </Link>
              <button
                onClick={() => setActiveTab('future')}
                className="border-3 border-cyan-300 bg-transparent text-white px-10 py-5 rounded-xl font-bold hover:bg-white hover:text-teal-900 transition-all duration-300 shadow-xl"
              >
                Explore Our Vision →
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-cyan-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span className="font-semibold">+977-9860218415</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">BirtaMode-3, Jhapa Nepal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Evolution Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4 mt-2">Our Business Solutions</h2>
            <p className="text-xl text-teal-600 max-w-3xl mx-auto">Comprehensive wood material supply with a vision for complete furniture solutions</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl p-2 inline-flex shadow-lg border-2 border-teal-200">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'current'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xl transform scale-105'
                    : 'text-teal-700 hover:bg-teal-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                  </svg>
                  Current Services
                </span>
              </button>
              <button
                onClick={() => setActiveTab('future')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'future'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xl transform scale-105'
                    : 'text-teal-700 hover:bg-teal-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                  Future Vision
                </span>
              </button>
            </div>
          </div>

          {/* Current Services */}
          {activeTab === 'current' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentServices.map((service, index) => (
                <div key={index} className="group bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-teal-100 hover:border-teal-300">
                  <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <h3 className="text-xl font-bold text-teal-900 mb-2 text-center">{service.title}</h3>
                  <p className="text-teal-700 mb-4 text-center text-sm">{service.description}</p>
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Future Services */}
          {activeTab === 'future' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {futureServices.map((service, index) => (
                <div key={index} className="group bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-100 hover:border-purple-300">
                  <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2 text-center">{service.title}</h3>
                  <p className="text-purple-700 mb-4 text-center text-sm">{service.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold animate-pulse shadow-md">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                        </svg>
                        {service.status}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-purple-600 text-center flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      {service.eta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Current Products Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Our Products</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4 mt-2">Premium Product Range</h2>
            <p className="text-xl text-teal-600 max-w-3xl mx-auto">High-quality raw materials available for immediate delivery</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentProducts.map((product, index) => (
              <div key={index} className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-teal-100">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                  <div className="text-8xl mb-4 relative group-hover:scale-110 transition-transform duration-300">{product.image}</div>
                  <span className="inline-block bg-white text-teal-800 px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {product.category}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-teal-900 mb-3">{product.name}</h3>
                  <p className="text-teal-700 mb-4 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-sm text-teal-600 font-medium">Price</span>
                      <p className="text-lg font-bold text-teal-900">{product.price}</p>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      In Stock
                    </div>
                  </div>
                  <Link
                    to="/buy"
                    className="group/btn w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-900 px-6 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg"
                  >
                    <svg className="w-5 h-5 group-hover/btn:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                    </svg>
                    Request Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Why Choose Us */}
          <div className="mt-16 bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-teal-100">
            <h3 className="text-3xl font-bold text-teal-900 mb-8 text-center">Why Choose Annapurna Veneer?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-teal-900 mb-2">ISO Certified</h4>
                <p className="text-teal-600 text-sm">All products meet international quality standards</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-teal-900 mb-2">Fast Delivery</h4>
                <p className="text-teal-600 text-sm">Quick and reliable delivery across Nepal</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-teal-900 mb-2">Best Prices</h4>
                <p className="text-teal-600 text-sm">Competitive wholesale rates for bulk orders</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-teal-900 mb-2">24/7 Support</h4>
                <p className="text-teal-600 text-sm">Expert assistance whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Vision Section */}
      <section className="py-20 bg-gradient-to-r from-teal-800 to-emerald-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-teal-600"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0l-8.485 8.485 1.414 1.414L28.828 0h-.828zm5.656 0l-8.485 8.485 1.414 1.414L34.142 0h-.486zm5.656 0l-8.485 8.485 1.414 1.414L39.8 0h-.488zM0 5.373l-.828.83L0 8.2V5.374zm0 5.656l-.828.83L0 13.857v-2.828zm0 5.656l-.828.83L0 19.514v-2.83zm0 5.657l-.828.828L0 25.172V22.34zm0 5.657l-.828.828L0 30.83v-2.83zm0 5.657l-.828.828L0 36.486v-2.83zm0 5.656l-.828.83L0 42.143v-2.828zm0 5.657l-.828.828L0 47.8v-2.827zm0 5.657v2.828l-.828-.828L0 53.456zM60 5.373V8.2l.828-1.998-.828-.83zm0 5.656v2.828l.828-1.998-.828-.83zm0 5.656v2.83l.828-2-.828-.83zm0 5.657v2.828l.828-1.998-.828-.83zm0 5.657v2.83l.828-2-.828-.83zm0 5.657v2.828l.828-1.998-.828-.83zm0 5.656v2.83l.828-2-.828-.83zm0 5.657v2.828l.828-1.998-.828-.83zm0 5.657v2.828l.828-1.998-.828-.83zM32.285 60l-8.485-8.485 1.414-1.414 7.9 7.9H32.285zm-5.656 0l-8.485-8.485 1.414-1.414 7.9 7.9h-.829zm-5.656 0l-8.485-8.485 1.414-1.414 7.9 7.9h-.829zm-5.657 0L6.83 51.515l1.414-1.414 7.9 7.9H15.316zm-5.656 0l-8.485-8.485 1.414-1.414 7.9 7.9H9.66zm51.97 0l-8.485-8.485 1.415-1.414 7.9 7.9H61.63zm-5.657 0l-8.485-8.485 1.414-1.414 7.9 7.9h-.829zm-5.656 0l-8.485-8.485 1.414-1.414 7.9 7.9h-.829zm-5.657 0l-8.485-8.485 1.415-1.414 7.9 7.9h-.83zm-5.656 0l-8.485-8.485 1.414-1.414 7.9 7.9h-.829z' fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 mt-2">Building the Future Together</h2>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
              From trusted raw material supplier to your complete wood & furniture solutions partner
            </p>
          </div>
          
          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-teal-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Today</h3>
              <p className="text-cyan-100 leading-relaxed">Premium Plywood Raw Materials & Veneer Supply with guaranteed quality and timely delivery</p>
            </div>
            
            <div className="group bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-teal-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">2026-2027</h3>
              <p className="text-cyan-100 leading-relaxed">Expanding to Complete Wood Processing & Custom Furniture Manufacturing services</p>
            </div>
            
            <div className="group bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-teal-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Beyond</h3>
              <p className="text-cyan-100 leading-relaxed">Your One-Stop Shop for All Wood, Furniture & Interior Design Solutions</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-yellow-400 mb-2">500+</div>
              <div className="text-cyan-100 font-medium">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-yellow-400 mb-2">15+</div>
              <div className="text-cyan-100 font-medium">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-yellow-400 mb-2">50+</div>
              <div className="text-cyan-100 font-medium">Product Varieties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-yellow-400 mb-2">100%</div>
              <div className="text-cyan-100 font-medium">Quality Guaranteed</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/buy"
              className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-900 px-10 py-5 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3"
            >
              <svg className="w-6 h-6 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              Start Your Order Today
            </Link>
            <a
              href="tel:+9779860218415"
              className="border-3 border-white bg-transparent text-white px-10 py-5 rounded-xl font-bold hover:bg-white hover:text-teal-900 transition-all duration-300 shadow-xl flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
