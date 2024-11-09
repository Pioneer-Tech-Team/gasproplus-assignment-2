import { useState, useEffect } from "react";

type VoucherFormProps = {
  onSubmit: (voucher: {
    voucherNo: number;
    voucherDate: string;
    amount: number;
    narration: string;
    voucherTypeId: number;
    companyId: number | null;
  }) => void;
  existingVoucher?: {
    voucherNo: number;
    voucherDate: string;
    amount: number;
    narration?: string;
    voucherTypeId: number;
    companyId: number | null;
  };
};

type Company = {
  id: number;
  name: string;
};

const VoucherForm: React.FC<VoucherFormProps> = ({ onSubmit, existingVoucher }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [voucherNo, setVoucherNo] = useState(existingVoucher?.voucherNo || 0);
  const [voucherDate, setVoucherDate] = useState(existingVoucher?.voucherDate || "");
  const [amount, setAmount] = useState(existingVoucher?.amount || 0);
  const [narration, setNarration] = useState(existingVoucher?.narration || "");
  const [voucherTypeId, setVoucherTypeId] = useState(existingVoucher?.voucherTypeId || 0);
  const [companyId, setCompanyId] = useState(existingVoucher?.companyId || null);

  useEffect(() => {
    fetch("/api/company")
      .then(response => response.json())
      .then(data => {
        setCompanies(data);
      })
      .catch(error => {
        console.error("Error fetching companies:", error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ voucherNo, voucherDate, amount, narration, voucherTypeId, companyId });
    setVoucherNo(0);
    setVoucherDate("");
    setAmount(0);
    setNarration("");
    setVoucherTypeId(0);
    setCompanyId(null);
  };

  useEffect(() => {
    if (existingVoucher) {
      setVoucherNo(existingVoucher.voucherNo);
      setVoucherDate(existingVoucher.voucherDate);
      setAmount(existingVoucher.amount);
      setNarration(existingVoucher.narration || "");
      setVoucherTypeId(existingVoucher.voucherTypeId);
      setCompanyId(existingVoucher.companyId || null);
    }
  }, [existingVoucher]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl mb-4">{existingVoucher ? "Edit Voucher" : "Add Voucher"}</h2>
      <input
        type="number"
        value={voucherNo}
        onChange={(e) => setVoucherNo(Number(e.target.value))}
        placeholder="Voucher Number"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="date"
        value={voucherDate}
        onChange={(e) => setVoucherDate(e.target.value)}
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <textarea
        value={narration}
        onChange={(e) => setNarration(e.target.value)}
        placeholder="Narration (optional)"
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        value={voucherTypeId}
        onChange={(e) => setVoucherTypeId(Number(e.target.value))}
        required
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Voucher Type</option>
        {/* TODO: populate &add options for voucher type  */}
      </select>
      <select
        value={companyId ?? ""}
        onChange={(e) => setCompanyId(Number(e.target.value) || null)}
        required
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Company</option>
        {companies.map(company => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
        {existingVoucher ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default VoucherForm;