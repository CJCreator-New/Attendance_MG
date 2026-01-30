import { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext(null);

const DEFAULT_COMPANY = {
  id: 'company_001',
  name: 'MAGA TECH GRAMAM PVT LTD',
  branches: [
    {
      id: 'branch_001',
      name: 'Salem Head Office',
      address: '59/2M, Ayyarkadu, Erumaipatti, Edappady, Salem - 637102'
    },
    {
      id: 'branch_002',
      name: 'Karaikudi Operating Office',
      address: 'ACGCET Main Building, Karaikudi - 630003'
    }
  ],
  branding: {
    logo: null,
    primaryColor: '#2563eb',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b'
  },
  settings: {
    financialYearStart: 'April',
    weekOffDay: 'Sunday',
    professionalTax: 200,
    epfApplicable: true,
    esiApplicable: false,
    epfMaxBase: 15000,
    epfRate: 0.12
  }
};

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([DEFAULT_COMPANY]);
  const [currentCompany, setCurrentCompany] = useState(DEFAULT_COMPANY);
  const [currentBranch, setCurrentBranch] = useState(DEFAULT_COMPANY.branches[0]);

  useEffect(() => {
    const saved = localStorage.getItem('companies');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompanies(parsed);
      setCurrentCompany(parsed[0]);
      setCurrentBranch(parsed[0].branches[0]);
    }
  }, []);

  const updateCompany = (companyData) => {
    const updated = companies.map(c => c.id === companyData.id ? companyData : c);
    setCompanies(updated);
    setCurrentCompany(companyData);
    localStorage.setItem('companies', JSON.stringify(updated));
  };

  const selectBranch = (branchId) => {
    const branch = currentCompany.branches.find(b => b.id === branchId);
    if (branch) setCurrentBranch(branch);
  };

  return (
    <CompanyContext.Provider value={{
      companies,
      currentCompany,
      currentBranch,
      setCurrentCompany,
      selectBranch,
      updateCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompany must be used within CompanyProvider');
  return context;
};
