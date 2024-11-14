"use client";
import { useState, useEffect } from "react";

const VoucherDetailsPage = () => {
  const [voucher, setVoucher] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [newDetail, setNewDetail] = useState({
    amount: "",
    drcr: "",
    remark: "",
    accountId: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [voucherId, setVoucherId] = useState<string | null>(null);

  useEffect(() => {
    // Get voucherId from the URL path on client side
    const id = window.location.pathname.split("/").pop() || null;
    setVoucherId(id);
  }, []);

  useEffect(() => {
    if (voucherId) {
      // Fetch voucher details from the API
      console.log("Fetching voucher details for voucherId:", voucherId);
      fetch(`/api/voucher-details?voucherId=${voucherId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
        })
        .catch((error) => console.error("Error fetching voucher data:", error));
    }
  }, [voucherId]);

useEffect(() => {
    fetch("/api/accounts")
        .then((response) => response.json())
        .then((accounts) => {
            console.log("Fetched accounts:", accounts);
            setAccounts(accounts);
        })
        .catch((error) => console.error("Error fetching accounts:", error));
}, []);

  const handleAddDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/voucher-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voucherId, details: [newDetail] }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Log the response to check if it's an object
      setData(data || []); // Adjust if the data is nested
      setDetails((prevDetails) => [
        ...prevDetails,
        ...(Array.isArray(data) ? data : []),
      ]);
      setNewDetail({ amount: "", drcr: "", remark: "", accountId: "" });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding voucher detail:", error);
    }
  };
  return (
    <div>
      <h1>Voucher Details for Voucher ID - {voucherId}</h1>
      <button
        onClick={() => setIsAdding(!isAdding)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        {isAdding ? "Cancel" : "Add Voucher Detail"}
      </button>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Voucher Detail</h2>
            <form onSubmit={handleAddDetail}>
              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <input
                  type="number"
                  value={newDetail.amount}
                  onChange={(e) =>
                    setNewDetail({ ...newDetail, amount: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Dr/Cr</label>
                <select
                  value={newDetail.drcr}
                  onChange={(e) =>
                    setNewDetail({ ...newDetail, drcr: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="-1">Debit</option>
                  <option value="1">Credit</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Remark</label>
                <input
                  type="text"
                  value={newDetail.remark}
                  onChange={(e) =>
                    setNewDetail({ ...newDetail, remark: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Account ID</label>
                <select
                  value={newDetail.accountId}
                  onChange={(e) =>
                    setNewDetail({ ...newDetail, accountId: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition duration-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                  Add Detail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {Array.isArray(data) && data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item: any, index: number) => (
            <div key={index} className="card p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Detail {index + 1}</h2>
              <p>
                <strong>Amount:</strong> {item.amount}
              </p>
              <p>
                <strong>Dr/Cr:</strong> {item.drcr}
              </p>
              <p>
                <strong>Remark:</strong> {item.remark}
              </p>
              <p>
                <strong>Account ID:</strong> {item.accountId}
              </p>
              <p>
                <strong>Account Name:</strong> {item.account.name}
              </p>
              <p>
                <strong>Company ID:</strong> {item.account.companyId}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No voucher details found or invalid data.</p>
      )}
    </div>
  );
};

export default VoucherDetailsPage;
