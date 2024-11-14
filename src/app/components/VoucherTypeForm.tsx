import { useState, useEffect } from "react";

type VoucherTypeFormProps = {
  onSubmit: (voucherType: {
    id?: number;
    shortForm: string;
    name: string;
    drFilter: string;
    crFilter: string;
    relationship: string;
    manyDr: boolean;
    manyCr: boolean;
  }) => void;
  existingVoucherType?: {
    id: number;
    shortForm: string;
    name: string;
    drFilter: string;
    crFilter: string;
    relationship: string;
    manyDr: boolean;
    manyCr: boolean;
  };
};

const VoucherTypeForm: React.FC<VoucherTypeFormProps> = ({
  onSubmit,
  existingVoucherType,
}) => {
  const [shortForm, setShortForm] = useState(existingVoucherType?.shortForm || "");
  const [name, setName] = useState(existingVoucherType?.name || "");
  const [drFilter, setDrFilter] = useState(existingVoucherType?.drFilter || "");
  const [crFilter, setCrFilter] = useState(existingVoucherType?.crFilter || "");
  const [relationship, setRelationship] = useState(existingVoucherType?.relationship || "");
  const [manyDr, setManyDr] = useState(existingVoucherType?.manyDr || false);
  const [manyCr, setManyCr] = useState(existingVoucherType?.manyCr || false);

  useEffect(() => {
    if (existingVoucherType) {
      setShortForm(existingVoucherType.shortForm);
      setName(existingVoucherType.name);
      setDrFilter(existingVoucherType.drFilter);
      setCrFilter(existingVoucherType.crFilter);
      setRelationship(existingVoucherType.relationship);
      setManyDr(existingVoucherType.manyDr);
      setManyCr(existingVoucherType.manyCr);
    }
  }, [existingVoucherType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const voucherTypeData = {
      id: existingVoucherType?.id,
      shortForm,
      name,
      drFilter,
      crFilter,
      relationship,
      manyDr,
      manyCr,
    };
    onSubmit(voucherTypeData);
    setShortForm("");
    setName("");
    setDrFilter("");
    setCrFilter("");
    setRelationship("");
    setManyDr(false);
    setManyCr(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl mb-4">{existingVoucherType ? "Edit Voucher Type" : "Add Voucher Type"}</h2>
      <input
        type="text"
        value={shortForm}
        onChange={(e) => setShortForm(e.target.value)}
        placeholder="Short Form"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Voucher Type Name"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        value={drFilter}
        onChange={(e) => setDrFilter(e.target.value)}
        placeholder="DR Filter"
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        value={crFilter}
        onChange={(e) => setCrFilter(e.target.value)}
        placeholder="CR Filter"
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        placeholder="Relationship"
        className="w-full p-2 mb-2 border rounded"
      />
      <label className="block mb-2">
        <input
          type="checkbox"
          checked={manyDr}
          onChange={(e) => setManyDr(e.target.checked)}
        />
        Many DR
      </label>
      <label className="block mb-2">
        <input
          type="checkbox"
          checked={manyCr}
          onChange={(e) => setManyCr(e.target.checked)}
        />
        Many CR
      </label>
      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded"
      >
        {existingVoucherType ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default VoucherTypeForm;
