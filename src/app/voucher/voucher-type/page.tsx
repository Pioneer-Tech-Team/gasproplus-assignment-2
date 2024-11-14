"use client"
import { useState, useEffect } from "react";
import VoucherTypeForm from "@/app/components/VoucherTypeForm";
import VoucherTypeList from "@/app/components/VoucherTypeList";

const VoucherTypePage: React.FC = () => {
  const [voucherTypes, setVoucherTypes] = useState<any[]>([]);
  const [editingVoucherType, setEditingVoucherType] = useState<any | null>(null);

  // Fetch all voucher types when the page loads
  useEffect(() => {
    fetchVoucherTypes();
  }, []);

  const fetchVoucherTypes = async () => {
    try {
      const res = await fetch("/api/voucher-type");
      const data = await res.json();
      setVoucherTypes(data);
    } catch (error) {
      console.error("Error fetching voucher types:", error);
    }
  };

  const handleAddVoucherType = async (voucherType: {
    id?: number;
    shortForm: string;
    name: string;
    drFilter: string;
    crFilter: string;
    relationship: string;
    manyDr: boolean;
    manyCr: boolean;
  }) => {
    try {
      const method = voucherType.id ? "PUT" : "POST";
      const url = "/api/voucher-type";
      const body = JSON.stringify(voucherType);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await res.json();

      if (voucherType.id) {
        // Update the existing voucher type
        setVoucherTypes(
          voucherTypes.map((v) => (v.id === data.id ? data : v))
        );
      } else {
        // Add the new voucher type to the list
        setVoucherTypes([...voucherTypes, data]);
      }
      setEditingVoucherType(null); // Reset the editing state after submit
    } catch (error) {
      console.error("Error adding/updating voucher type:", error);
    }
  };

  const handleEditVoucherType = (voucherType: any) => {
    setEditingVoucherType(voucherType);
  };

  const handleDeleteVoucherType = async (id: number) => {
    try {
      await fetch("/api/voucher-type", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setVoucherTypes(voucherTypes.filter((voucherType) => voucherType.id !== id));
    } catch (error) {
      console.error("Error deleting voucher type:", error);
    }
  };

    const [showModal, setShowModal] = useState(false);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Voucher Type Management</h1>

      {/* VoucherTypeForm component to add or edit a voucher type */}
      {/* <VoucherTypeForm onSubmit={handleAddVoucherType} existingVoucherType={editingVoucherType} /> */}
    {/* Button to open the modal */}
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={() => setShowModal(true)}
    >
      Add New Voucher Type
    </button>

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Add New Voucher Type</h2>
        <VoucherTypeForm
          onSubmit={(voucherType) => {
            handleAddVoucherType(voucherType);
            setShowModal(false);
          }}
          existingVoucherType={editingVoucherType}
        />
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
        </div>
      </div>
    )}
      {/* VoucherTypeList component to show all the voucher types */}
      <div className="mt-8">
        <h3 className="text-xl mb-4">Voucher Types List</h3>
        <VoucherTypeList
          voucherTypes={voucherTypes}
          onEdit={handleEditVoucherType}
          onDelete={handleDeleteVoucherType}
        />
      </div>
    </div>
  );
};

export default VoucherTypePage;
