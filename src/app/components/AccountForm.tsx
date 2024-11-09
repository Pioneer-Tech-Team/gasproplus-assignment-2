"use client";
import { useState, useEffect } from "react";

type Account = {
  id?: number;
  parent_id?: number | null;
  is_group: boolean;
  name: string;
};

interface AccountFormProps {
  onSubmit: (account: Omit<Account, "id">) => Promise<void>;
  existingAccount?: Account | null;
  parentAccounts: Account[];
}

const AccountForm: React.FC<AccountFormProps> = ({ onSubmit, existingAccount, parentAccounts }) => {
  const [name, setName] = useState(existingAccount?.name || "");
  const [parentId, setParentId] = useState(existingAccount?.parent_id || null);
  const [isGroup, setIsGroup] = useState(existingAccount?.is_group || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, parent_id: parentId, is_group: isGroup });
    setName("");
    setParentId(null);
    setIsGroup(false);
  };

  useEffect(() => {
    if (existingAccount) {
      setName(existingAccount.name);
      setParentId(existingAccount.parent_id ?? null);
      setIsGroup(existingAccount.is_group);
    }
  }, [existingAccount]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl mb-4">{existingAccount ? "Edit Account" : "Add Account"}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Account Name"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        value={parentId ?? ""}
        onChange={(e) => setParentId(Number(e.target.value) || null)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Parent Account (optional)</option>
        {parentAccounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={isGroup}
          onChange={() => setIsGroup(!isGroup)}
          className="mr-2"
        />
        Is Group?
      </label>
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
        {existingAccount ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default AccountForm;
