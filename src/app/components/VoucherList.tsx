"use client";
import { useState, useEffect } from "react";
import VoucherForm from "./VoucherForm";

type Voucher = {
  id: number;
  voucherNo: number;
  voucherDate: string;
  amount: number;
  narration?: string;
  voucherTypeId: number;
  companyId: number | null;
};

const VoucherList = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      const response = await fetch("/api/voucher");
      const data = await response.json();
      setVouchers(data);
    };
    fetchVouchers();
  }, []);

  const handleAddVoucher = async (voucher: Omit<Voucher, "id">) => {
    const response = await fetch("/api/voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voucher),
    });
    if (response.ok) {
      const newVoucher = await response.json();
      setVouchers([...vouchers, newVoucher]);
      setShowModal(false);
    }
  };

  const handleDeleteVoucher = async (id: number) => {
    await fetch(`/api/voucher/${id}`, { method: "DELETE" });
    setVouchers(vouchers.filter((voucher) => voucher.id !== id));
  };

  return (
    <div className="p-4">
      <button onClick={() => setShowModal(true)} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Add Voucher
      </button>
      {vouchers.map((voucher) => (
        <div key={voucher.id} className="p-4 border rounded shadow-lg mb-4 bg-white hover:bg-gray-100 hover:border-gray-300">
            <a href={`/voucher/${voucher.id}`} >
            <div className="flex flex-col">
              <span className="font-bold">No: {voucher.voucherNo}</span>
              <span>Date: {new Date(voucher.voucherDate).toLocaleDateString()}</span>
              <span>Amount: ₹{voucher.amount}</span>
              <span>Narration: {voucher.narration}</span>
              <span>Type ID: {voucher.voucherTypeId}</span>
            </div>
            </a>
        </div>
      ))}


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <VoucherForm
              onSubmit={handleAddVoucher}
              existingVoucher={selectedVoucher || undefined}
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

export default VoucherList;
