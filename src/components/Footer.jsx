import { useCompany } from '../contexts/CompanyContext';

const Footer = () => {
  const { selectedCompany } = useCompany();
  const companyName = selectedCompany?.name || 'Annapurna Veneer';
  const companyInitials = companyName.split(' ').map(word => word[0]).join('').toUpperCase();

  return (
    <footer className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white border-t-4 border-yellow-500 shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-3 shadow-xl border-4 border-yellow-300">
                <span className="text-white font-bold text-xl">{companyInitials}</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">{companyName}</h3>
            </div>
            <p className="text-cyan-200 mb-4 font-medium">
              Leading supplier of premium quality plywood and veneer products. 
              We provide the finest wood solutions for construction, furniture, and industrial applications.
            </p>
            <div className="text-cyan-100 space-y-2">
              <p className="mb-2 flex items-center"><span className="mr-2">📍</span> BirtaMode-3, Jhapa Nepal</p>
              <p className="mb-2 flex items-center"><span className="mr-2">📞</span> +977-9860218415</p>
              <p className="mb-2 flex items-center"><span className="mr-2">✉️</span> annapurnaveneerudhyog@gmail.com</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300 border-b-2 border-teal-600 pb-2">Our Products</h4>
            <ul className="space-y-2 text-cyan-100">
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Marine Plywood</li>
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Commercial Plywood</li>
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Decorative Veneer</li>
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Block Boards</li>
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• MDF & HDF</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300 border-b-2 border-teal-600 pb-2">Services</h4>
            <ul className="space-y-2 text-cyan-100">
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Bulk Supply</li>
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Custom Cutting</li>
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Quality Testing</li>
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Delivery Service</li>
              <li className="hover:text-yellow-300 transition-colors cursor-pointer">• Technical Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-yellow-300 text-sm font-medium">
              © 2025 {companyName}. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mt-4 md:mt-0 items-center">
              <span className="text-cyan-200 text-sm font-medium">Made with ❤️ for quality wood solutions</span>
              <span className="text-cyan-200 text-sm font-medium">• Created By Nitesh Raj</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;