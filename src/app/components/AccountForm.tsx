"use client";
import { useState } from "react";

type Account = {
  id?: number;
  name: string;
  is_group: boolean;
  parent_id: number | null;
};

interface AccountFormProps {
  onSubmit: (account: Omit<Account, "id" | "children">) => Promise<void>;
  parentAccounts: Account[];
  selectedAccount?: Account | null;
}

const AccountForm: React.FC<AccountFormProps> = ({
  onSubmit,
  parentAccounts,
}) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isGroup = parentId !== null;
    onSubmit({ name, is_group: isGroup, parent_id: parentId });
    setName("");
    setParentId(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Account Name"
        required
        className="border p-2 rounded mr-2"
      />
      <select
        value={parentId ?? ""} // empty string for individual ac
        onChange={(e) =>
          setParentId(e.target.value ? Number(e.target.value) : null)
        }
        className="border p-2 rounded mr-2"
      >
        <option value="">Individual</option>
        {parentAccounts.map((account, i) => (
          <option key={i} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add
      </button>
    </form>
  );
};

export default AccountForm;
