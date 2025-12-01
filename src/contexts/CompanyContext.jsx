import React, { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    // Load selected company from localStorage on mount
    const storedCompany = localStorage.getItem('selectedCompany');
    if (storedCompany) {
      setSelectedCompany(JSON.parse(storedCompany));
    }
  }, []);

  const selectCompany = (company) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
  };

  const clearCompany = () => {
    setSelectedCompany(null);
    localStorage.removeItem('selectedCompany');
  };

  const getApiUrl = () => {
    if (!selectedCompany) return null;
    // Base API URL with company identifier
    return `https://annapurna-veneer-backend.onrender.com/api/v1/${selectedCompany.id}`;
  };

  return (
    <CompanyContext.Provider
      value={{
        selectedCompany,
        selectCompany,
        clearCompany,
        getApiUrl,
        isCompanySelected: !!selectedCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
