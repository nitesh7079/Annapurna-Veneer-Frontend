import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatStep, setChatStep] = useState('greeting'); // greeting, form, submitted
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Ply products with images
  const plyProducts = [
    { id: 1, name: '2.5mm Core Ply', image: './Ply/p1.jpg', price: '₹120/sq.ft', desc: 'High-density core plywood' },
    { id: 2, name: '2.5mm Fali Ply', image: './Ply/p2.jpg', price: '₹110/sq.ft', desc: 'Economy grade plywood' },
    { id: 3, name: '1.8mm Core Ply', image: './Ply/p3.jpg', price: '₹95/sq.ft', desc: 'Standard core plywood' },
    { id: 4, name: '1.8mm Fali Ply', image: './Ply/p4.jpg', price: '₹85/sq.ft', desc: 'Budget-friendly option' },
    { id: 5, name: 'Marine Ply', image: './Ply/p5.jpg', price: '₹150/sq.ft', desc: 'Waterproof grade BWP' },
    { id: 6, name: 'Commercial Ply', image: './Ply/p6.jpg', price: '₹130/sq.ft', desc: 'MR grade plywood' },
    { id: 7, name: 'Waterproof Ply', image: './Ply/p7.jpg', price: '₹140/sq.ft', desc: 'BWR grade plywood' },
    { id: 8, name: 'Block Board', image: './Ply/p8.jpg', price: '₹125/sq.ft', desc: 'Solid core board' },
    { id: 9, name: 'MDF Board', image: './Ply/p9.jpg', price: '₹100/sq.ft', desc: 'Medium density fiber' },
    { id: 10, name: 'Veneer Sheet', image: './Ply/10.jpg', price: '₹160/sq.ft', desc: 'Premium decorative' },
  ];

  // Furniture products
  const furnitureProducts = [
    { id: 1, name: 'Luxury Sofa Set', image: './laxury/Luxury Sofa Set.jpg', price: '₹45,000', desc: '5-seater premium sofa' },
    { id: 2, name: 'King Size Bed', image: './laxury/King Size Bed.jpg', price: '₹35,000', desc: 'Solid wood king bed' },
    { id: 3, name: 'Dining Table Set', image: './laxury/DiningTableSet.jpg', price: '₹28,000', desc: '6-seater dining set' },
    { id: 4, name: 'Wardrobe', image: './laxury/Wardrobe.jpg', price: '₹50,000', desc: 'Spacious wardrobe' },
    { id: 5, name: 'Study Table', image: './laxury/Study Table.jpg', price: '₹15,000', desc: 'Ergonomic study desk' },
    { id: 6, name: 'TV Unit', image: './laxury/TV Unit.jpg', price: '₹22,000', desc: 'Modern TV cabinet' },
  ];

  const handleComingSoon = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Use FormSubmit.co - a free form submission service
      const formSubmitURL = 'https://formsubmit.co/ashishs8927@gmail.com';
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('message', formData.message);
      submitData.append('_subject', 'New Contact Form Submission - Shyam Veneer');
      submitData.append('_captcha', 'false'); // Disable captcha
      submitData.append('_template', 'table'); // Use table format
      
      const response = await fetch(formSubmitURL, {
        method: 'POST',
        body: submitData
      });
      
      if (response.ok) {
        console.log('Form submitted successfully:', formData);
        setChatStep('submitted');
        setTimeout(() => {
          setShowChatbot(false);
          setChatStep('greeting');
          setFormData({ name: '', email: '', phone: '', message: '' });
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Still show success to user but log error
      setChatStep('submitted');
      setTimeout(() => {
        setShowChatbot(false);
        setChatStep('greeting');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    }
  };

  const ProductCard = ({ product, category }) => (
    <div className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 mx-3">
      <div className="relative group">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/92400e/ffffff?text=' + product.name;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.desc}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-amber-700">{product.price}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleComingSoon}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-200 text-sm"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );

  const MarqueeSection = ({ title, products, category, direction = 'left' }) => (
    <div className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto rounded-full"></div>
      </div>
      <div className="relative overflow-hidden py-4">
        <div className={`flex ${direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}`}>
          {[...products, ...products].map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} category={category} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-md mx-4 border-t-4 border-amber-600">
            <div className="text-center">
              <div className="text-7xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">Coming Soon!</h3>
              <p className="text-gray-600 text-lg">Company will launch this feature soon</p>
              <p className="text-amber-700 font-semibold mt-2">Call us to place your order</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chatbot Window */}
        {showChatbot && (
          <div className="mb-4 bg-white rounded-2xl shadow-2xl w-80 sm:w-96 animate-fadeInUp border-2 border-amber-600">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold">Shyam Assistant</h3>
                  <p className="text-xs text-amber-100">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatbot(false)}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Greeting Step */}
              {chatStep === 'greeting' && (
                <div className="space-y-4">
                  <div className="bg-amber-100 text-amber-900 p-4 rounded-lg rounded-tl-none animate-fadeIn">
                    <p className="mb-2">👋 Hello! Welcome to Shyam Veneer!</p>
                    <p className="mb-3">How are you today?</p>
                    <p className="text-sm">I'm here to help you with your plywood and furniture needs.</p>
                  </div>
                  <button
                    onClick={() => setChatStep('form')}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105"
                  >
                    I'd like to contact you
                  </button>
                </div>
              )}

              {/* Form Step */}
              {chatStep === 'form' && (
                <div className="animate-fadeIn">
                  <div className="bg-amber-100 text-amber-900 p-4 rounded-lg rounded-tl-none mb-4">
                    <p className="mb-2">Great! Please fill in your details:</p>
                    <p className="text-sm">We'll get back to you as soon as possible!</p>
                  </div>
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        placeholder="+977-9860218415"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setChatStep('greeting')}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Submitted Step */}
              {chatStep === 'submitted' && (
                <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center animate-fadeIn">
                  <div className="text-5xl mb-3">✅</div>
                  <p className="font-bold text-lg mb-2">Thank you!</p>
                  <p className="text-sm">We've received your message and will contact you soon.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chatbot Button */}
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white w-16 h-16 rounded-full shadow-2xl hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-110 flex items-center justify-center relative group"
        >
          {showChatbot ? (
            <span className="text-2xl">✕</span>
          ) : (
            <>
              <span className="text-3xl animate-bounce-slow">🤖</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
            </>
          )}
          {!showChatbot && (
            <span className="absolute -top-12 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Need help? Chat with us!
            </span>
          )}
        </button>
      </div>

      {/* Hero Section - Modern & Clean */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-orange-800 to-amber-900"></div>
        <div className="absolute inset-0 opacity-10 animate-pulse" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"%/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fadeInUp">
          <div className="inline-block mb-6 animate-bounce-slow">
            <span className="bg-amber-100 backdrop-blur-md text-amber-900 px-6 py-2.5 rounded-full text-sm font-semibold border border-amber-300 shadow-lg">
              ✨ Leading Plywood & Furniture Supplier in Nepal
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Shyam Veneer
          </h1>
          
          <p className="text-xl md:text-3xl text-amber-50 mb-4 font-light drop-shadow-lg">
            Premium Plywood, Furniture & Wood Solutions
          </p>
          
          <p className="text-lg md:text-xl text-amber-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Quality Products • Competitive Prices • Fast Delivery
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animation-delay-300">
            <Link
              to="/buy"
              className="group bg-amber-100 text-amber-900 px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-amber-300/50 transform hover:scale-110 transition-all duration-300 flex items-center gap-2 hover:bg-amber-200"
            >
              <span>Browse Products</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
            <a
              href="tel:+977-9860218415"
              className="border-2 border-amber-100 text-amber-50 px-8 py-4 rounded-xl font-bold hover:bg-amber-100 hover:text-amber-900 transition-all duration-300 transform hover:scale-105"
            >
              📞 Call: +977-9860218415
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" fillOpacity="0.3"/>
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 40C840 50 960 70 1080 80C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="#fef3c7"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.5"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Premium Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our extensive range of quality plywood and luxury furniture
          </p>
        </div>

        <div className="space-y-8">
          {/* Plywood Collection */}
          <MarqueeSection 
            title="🪵 Premium Plywood Collection" 
            products={plyProducts} 
            category="Plywood"
            direction="left"
          />

          {/* Furniture Collection */}
          <MarqueeSection 
            title="🛋️ Luxury Furniture Range" 
            products={furnitureProducts} 
            category="Furniture"
            direction="right"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Shyam Veneer?</h2>
            <p className="text-xl text-gray-600">Your trusted partner for all wood needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '✅', title: 'Premium Quality', desc: 'ISI certified products with superior quality standards' },
              { icon: '💰', title: 'Best Prices', desc: 'Competitive pricing with wholesale discounts' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick and reliable delivery across Nepal' },
              { icon: '🤝', title: 'Trusted Service', desc: 'Years of experience serving satisfied customers' }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")'}}></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg animate-fadeInUp text-white">Ready to Order?</h2>
          <p className="text-xl md:text-2xl text-amber-50 mb-10 font-light drop-shadow-md animate-fadeInUp animation-delay-200">
            Contact us today for bulk orders and special pricing
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fadeInUp animation-delay-400">
            <a
              href="tel:+977-9860218415"
              className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-3 hover:shadow-green-500/50"
            >
              <span className="text-2xl group-hover:animate-bounce">📞</span>
              <span>Call: +977-9860218415</span>
            </a>
            <a
              href="mailto:annapurnaveneerudhyog@gmail.com"
              className="border-2 border-amber-100 text-amber-50 px-8 py-4 rounded-xl font-bold hover:bg-amber-100 hover:text-amber-900 transition-all duration-300 flex items-center gap-3 transform hover:scale-105"
            >
              <span className="text-2xl">✉️</span>
              <span>Email Us</span>
            </a>
          </div>

          <div className="mt-12 pt-12 border-t border-amber-300/30 animate-fadeInUp animation-delay-600">
            <p className="text-amber-100 text-lg mb-3 drop-shadow-md">Visit Our Location</p>
            <p className="text-amber-50 font-semibold text-xl drop-shadow-lg">BirtaMode-3, Jhapa, Nepal</p>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 50s linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Home;
