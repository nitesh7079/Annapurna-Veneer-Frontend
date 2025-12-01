import React from 'react';
import { useNavigate } from 'react-router-dom';

function CompanySelection() {
  const navigate = useNavigate();

  const companies = [
    {
      id: 'annapurna-veneer',
      name: 'Annapurna Veneer',
      description: 'Premium Plywood & Veneer Supplier',
      logo: '🏢',
      color: 'from-teal-600 to-emerald-600'
    },
    {
      id: 'company-2',
      name: 'Company 2',
      description: 'Your Business Description',
      logo: '🏭',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'company-3',
      name: 'Company 3',
      description: 'Your Business Description',
      logo: '🏪',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'company-4',
      name: 'Company 4',
      description: 'Your Business Description',
      logo: '🏬',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'company-5',
      name: 'Company 5',
      description: 'Your Business Description',
      logo: '🏛️',
      color: 'from-green-600 to-teal-600'
    }
  ];

  const handleCompanySelect = (company) => {
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-4">
            Select Your Company
          </h1>
          <p className="text-xl text-gray-600">
            Choose a company to access its management system
          </p>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => handleCompanySelect(company)}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-4 border-transparent hover:border-teal-400 overflow-hidden group"
            >
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-r ${company.color} p-6 text-center`}>
                <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {company.logo}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {company.name}
                </h2>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-600 text-center mb-4">
                  {company.description}
                </p>
                <button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:from-teal-700 hover:to-emerald-700 transform group-hover:scale-105 transition-all duration-300 shadow-lg">
                  Access System →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © 2025 Multi-Company Management System | Created By Nitesh Raj
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompanySelection;
