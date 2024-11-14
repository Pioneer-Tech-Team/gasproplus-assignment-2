"use client";
import { useState, useEffect } from "react";
import CompanyForm from "./CompanyForm";

type Company = {
  id: number;
  name: string;
};

const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await fetch("/api/company");
      const data = await response.json();
      setCompanies(data);
    };
    fetchCompanies();
  }, []);

  const handleAddCompany = async (company: Omit<Company, "id">) => {
    console.log(company);
    const response = await fetch("/api/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    });
    if (response.ok) {
      const newCompany = await response.json();
      setCompanies([...companies, newCompany]);
      setShowModal(false);
    }
  };

  const handleDeleteCompany = async (id: number) => {
    await fetch(`/api/company/${id}`, { method: "DELETE" });
    setCompanies(companies.filter((company) => company.id !== id));
  };

  return (
    <div className="p-4">
      <button onClick={() => setShowModal(true)} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Add Company
      </button>
      {companies.length >0  && companies.map((company) => (
        <div key={company.id} className="p-2 border rounded mb-2 flex justify-between hover:bg-gray-100 hover:border-blue-400">
        <a href={`/company/${company.id}`} className="flex-grow">
          <span>{company.name}</span>
        </a>
        <button
          onClick={() => handleDeleteCompany(company.id)}
          className="p-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>  
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <CompanyForm
              onSubmit={handleAddCompany}
              existingCompany={selectedCompany}
            />
            <button onClick={() => setShowModal(false)} className="mt-2 p-1 bg-gray-400 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
