import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Ply products with images
  const plyProducts = [
    { id: 1, name: '2.5mm Core Ply', image: './Ply/p1.jpg', price: '₹120/sq.ft' },
    { id: 2, name: '2.5mm Fali Ply', image: './Ply/p2.jpg', price: '₹110/sq.ft' },
    { id: 3, name: '1.8mm Core Ply', image: './Ply/p3.jpg', price: '₹95/sq.ft' },
    { id: 4, name: '1.8mm Fali Ply', image: './Ply/p4.jpg', price: '₹85/sq.ft' },
    { id: 5, name: 'Marine Ply', image: './Ply/p5.jpg', price: '₹150/sq.ft' },
    { id: 6, name: 'Commercial Ply', image: './Ply/p6.jpg', price: '₹130/sq.ft' },
    { id: 7, name: 'Waterproof Ply', image: './Ply/p7.jpg', price: '₹140/sq.ft' },
    { id: 8, name: 'Block Board', image: './Ply/p8.jpg', price: '₹125/sq.ft' },
    { id: 9, name: 'MDF Board', image: './Ply/p9.jpg', price: '₹100/sq.ft' },
    { id: 10, name: 'Veneer Sheet', image: './Ply/p10.jpg', price: '₹160/sq.ft' },
  ];

  // Furniture products (placeholder - you'll provide images)
  const furnitureProducts = [
    { id: 1, name: 'Luxury Sofa Set', image: '/furniture/f1.jpg', price: '₹45,000' },
    { id: 2, name: 'King Size Bed', image: '/furniture/f2.jpg', price: '₹35,000' },
    { id: 3, name: 'Dining Table Set', image: '/furniture/f3.jpg', price: '₹28,000' },
    { id: 4, name: 'Wardrobe', image: '/furniture/f4.jpg', price: '₹50,000' },
    { id: 5, name: 'Study Table', image: '/furniture/f5.jpg', price: '₹15,000' },
    { id: 6, name: 'TV Unit', image: '/furniture/f6.jpg', price: '₹22,000' },
    { id: 7, name: 'Coffee Table', image: '/furniture/f7.jpg', price: '₹12,000' },
    { id: 8, name: 'Bookshelf', image: '/furniture/f8.jpg', price: '₹18,000' },
    { id: 9, name: 'Shoe Rack', image: '/furniture/f9.jpg', price: '₹8,000' },
    { id: 10, name: 'Recliner Chair', image: '/furniture/f10.jpg', price: '₹25,000' },
  ];

  // Other products (placeholder - you'll provide images)
  const otherProducts = [
    { id: 1, name: 'Wood Polish', image: '/other/o1.jpg', price: '₹450/ltr' },
    { id: 2, name: 'Wood Adhesive', image: '/other/o2.jpg', price: '₹350/kg' },
    { id: 3, name: 'Laminate Sheets', image: '/other/o3.jpg', price: '₹800/sheet' },
    { id: 4, name: 'Edge Banding', image: '/other/o4.jpg', price: '₹200/meter' },
    { id: 5, name: 'Wood Screws', image: '/other/o5.jpg', price: '₹150/box' },
    { id: 6, name: 'Hinges Set', image: '/other/o6.jpg', price: '₹300/set' },
    { id: 7, name: 'Drawer Slides', image: '/other/o7.jpg', price: '₹400/pair' },
    { id: 8, name: 'Wood Varnish', image: '/other/o8.jpg', price: '₹500/ltr' },
    { id: 9, name: 'Sandpaper Set', image: '/other/o9.jpg', price: '₹100/set' },
    { id: 10, name: 'Wood Stain', image: '/other/o10.jpg', price: '₹600/ltr' },
  ];

  const handleComingSoon = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const ProductCard = ({ product, category }) => (
    <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-amber-200 mx-4">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-xl"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/d97706/ffffff?text=' + product.name;
          }}
        />
        <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-2">{product.name}</h3>
        <p className="text-2xl font-bold text-green-600 mb-4">{product.price}</p>
        <div className="flex gap-2">
          <button
            onClick={handleComingSoon}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-bold hover:from-amber-700 hover:to-amber-800 transition-all"
          >
            🛒 Add to Cart
          </button>
          <button
            onClick={handleComingSoon}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all"
          >
            💳 Buy Now
          </button>
        </div>
      </div>
    </div>
  );

  const MarqueeSection = ({ title, products, category, direction = 'left' }) => (
    <div className="py-12">
      <h2 className="text-4xl font-bold text-amber-900 mb-8 text-center">{title}</h2>
      <div className="relative overflow-hidden">
        <div className={`flex gap-4 ${direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}`}>
          {[...products, ...products].map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} category={category} />
          ))}
        </div>
      </div>
    </div>
  );

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform animate-bounce border-4 border-amber-500">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold text-amber-900 mb-2">Coming Soon!</h3>
              <p className="text-lg text-amber-700">Online shopping feature is under development</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block bg-amber-600 text-amber-100 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🌟 Leading Plywood & Furniture Supplier
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Shyam Veneer
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-amber-100">
              Premium Plywood, Furniture & Wood Solutions
            </p>
            <p className="text-lg md:text-xl mb-8 text-amber-200">
              Quality Products | Competitive Prices | Fast Delivery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/buy"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:from-amber-600 hover:to-amber-700 transform hover:scale-105 transition-all"
              >
                🛒 Browse Products
              </Link>
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' })}
                className="border-2 border-amber-300 text-amber-100 px-8 py-4 rounded-xl font-bold hover:bg-amber-300 hover:text-amber-900 transition-all"
              >
                📦 View Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-white">
        <div className="mx-auto max-w-full px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-amber-900 mb-4">Our Premium Collection</h2>
            <p className="text-xl text-amber-700">Explore our wide range of quality products</p>
          </div>

          {/* Ply Products Marquee */}
          <MarqueeSection 
            title="🪵 Premium Plywood Collection" 
            products={plyProducts} 
            category="Plywood"
            direction="left"
          />

          {/* Furniture Products Marquee */}
          <MarqueeSection 
            title="🛋️ Luxury Furniture Range" 
            products={furnitureProducts} 
            category="Furniture"
            direction="right"
          />

          {/* Other Products Marquee */}
          <MarqueeSection 
            title="🔧 Wood Accessories & Supplies" 
            products={otherProducts} 
            category="Accessories"
            direction="left"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">Why Choose Shyam Veneer?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-amber-200">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Premium Quality</h3>
              <p className="text-amber-700">ISI certified products with superior quality standards</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-amber-200">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Best Prices</h3>
              <p className="text-amber-700">Competitive pricing with wholesale discounts</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-amber-200">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Fast Delivery</h3>
              <p className="text-amber-700">Quick and reliable delivery across Nepal</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-amber-200">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Trusted Service</h3>
              <p className="text-amber-700">Years of experience serving satisfied customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 text-amber-100">
            Contact us today for bulk orders and special pricing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+977-9860218415"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-2xl"
            >
              📞 Call Now: +977-9860218415
            </a>
            <a
              href="mailto:annapurnaveneerudhyog@gmail.com"
              className="border-2 border-amber-300 text-amber-100 px-8 py-4 rounded-xl font-bold hover:bg-amber-300 hover:text-amber-900 transition-all"
            >
              ✉️ Email Us
            </a>
          </div>
        </div>
      </section>

      {/* CSS for Marquee Animation */}
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
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
