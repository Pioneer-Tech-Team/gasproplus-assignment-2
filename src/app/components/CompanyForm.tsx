"use client";
import { useState, useEffect } from "react";

type Company = {
  id?: number;
  name: string;
};

interface CompanyFormProps {
  onSubmit: (company: Omit<Company, "id">) => Promise<void>;
  existingCompany?: Company | null;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, existingCompany }) => {
  const [name, setName] = useState(existingCompany?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
    setName("");
  };

  useEffect(() => {
    if (existingCompany) {
      setName(existingCompany.name);
    }
  }, [existingCompany]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl mb-4">{existingCompany ? "Edit Company" : "Add Company"}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Company Name"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
        {existingCompany ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default CompanyForm;
