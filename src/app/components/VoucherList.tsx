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
  companyId?: number | undefined | null;
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
        <div key={voucher.id} className="p-2 border rounded mb-2 flex justify-between">
          <div>
            <span className="font-bold">No: {voucher.voucherNo}</span> | 
            <span> Date: {new Date(voucher.voucherDate).toLocaleDateString()}</span> | 
            <span> Amount: ${voucher.amount.toFixed(2)}</span>
          </div>
          <div>
            <button
              onClick={() => {
                setSelectedVoucher(voucher);
                setShowModal(true);
              }}
              className="mr-2 p-1 bg-yellow-400 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteVoucher(voucher.id)}
              className="p-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <VoucherForm
              onSubmit={handleAddVoucher}
              existingVoucher={selectedVoucher}
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
