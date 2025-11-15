const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white border-t-4 border-amber-600 shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center mr-3 shadow-xl border-4 border-amber-300">
                <span className="text-white font-bold text-xl">AV</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">Annapurna Veneer</h3>
            </div>
            <p className="text-amber-200 mb-4 font-medium">
              Leading supplier of premium quality plywood and veneer products. 
              We provide the finest wood solutions for construction, furniture, and industrial applications.
            </p>
            <div className="text-amber-100 space-y-2">
              <p className="mb-2 flex items-center"><span className="mr-2">📍</span> BirtaMode-3, Jhapa Nepal</p>
              <p className="mb-2 flex items-center"><span className="mr-2">📞</span> +977-9860218415</p>
              <p className="mb-2 flex items-center"><span className="mr-2">✉️</span> annapurnaveneerudhyog@gmail.com</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-300 border-b-2 border-amber-600 pb-2">Our Products</h4>
            <ul className="space-y-2 text-amber-100">
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Marine Plywood</li>
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Commercial Plywood</li>
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Decorative Veneer</li>
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Block Boards</li>
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• MDF & HDF</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-300 border-b-2 border-amber-600 pb-2">Services</h4>
            <ul className="space-y-2 text-amber-100">
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Bulk Supply</li>
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Custom Cutting</li>
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Quality Testing</li>
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Delivery Service</li>
              <li className="hover:text-amber-200 transition-colors cursor-pointer">• Technical Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-amber-300 text-sm font-medium">
              © 2025 Annapurna Veneer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-amber-200 text-sm font-medium">Made with ❤️ for quality wood solutions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;