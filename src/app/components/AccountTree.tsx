"use client";
import { useEffect, useState } from "react";
import AccountForm from "./AccountForm";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

type Account = {
  id: number;
  parent_id: number | null;
  is_group: boolean;
  name: string;
  children: Account[];
};

const AccountTree = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const response = await fetch("/api/accounts");
      const data = await response.json();
      const sanitizedData = data.map((account: any) => ({
        ...account,
        parent_id: account.parent_id ?? null,
      }));
      setAccounts(sanitizedData);
    };
    fetchAccounts();
  }, []);

  const handleAddAccount = async (
    account: Omit<Account, "id" | "children">
  ) => {
    const response = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    });
    const newAccount = await response.json();
    setAccounts([...accounts, newAccount]);
  };

  const handleDeleteAccount = async (id: number) => {
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  const buildTree = (data: Account[]): Account[] => {
    const map = new Map<number, Account>();
    const roots: Account[] = [];
    data.forEach((account) => map.set(account.id, { ...account, children: [] }));

    map.forEach((account) => {
      if (account.parent_id === null) {
        roots.push(account);
      } else {
        const parent = map.get(account.parent_id);
        if (parent) {
          parent.children.push(account);
        }
      }
    });

    return roots;
  };

  const tree = buildTree(accounts);

  const generateAccountCode = (account: Account): string => {
    let code = account.id.toString().padStart(5, "0");
    let parentId = account.parent_id;
    while (parentId !== null) {
      const parent = accounts.find((acc) => acc.id === parentId);
      if (parent) {
        code = parent.id.toString().padStart(5, "0") + code;
        parentId = parent.parent_id;
      }
    }
    return code;
  };

  const AccountAccordion: React.FC<{ account: Account; level: number }> = ({
    account,
    level,
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div >
        <div
          className={`flex items-center justify-between cursor-pointer p-2 rounded-md transition-all hover:bg-gray-100 hover:shadow-sm ${
            account.is_group ? "font-semibold text-blue-700" : "text-gray-800"
          }`}
          onClick={() => account.is_group && setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-2">
            {account.is_group ? (
              isOpen ? (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 text-gray-500" />
              )
            ) : (
              <div className="h-5 w-5 border-2 rounded-full border-blue-400 bg-blue-300" />
            )}
            <span>{account.name}</span>
          </div>
        </div>
        {isOpen && account.children && (
          <div className="ml-4 mt-1">
            {account.children.map((child) => (
              <AccountAccordion key={child.id} account={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const VisualHierarchy: React.FC<{ tree: Account[] }> = ({ tree }) => {
    const renderHierarchy = (account: Account) => (
      <div key={account.id}>
        {account.is_group ? (
          <div>
            <span className="font-bold">+{account.name}</span>
            {account.children && (
              <div className="ml-4 mt-1">
                {account.children.map((child) => (
                  <div key={child.id} className="ml-4">
                    {renderHierarchy(child)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>-{account.name}</div>
        )}
      </div>
    );

    return <div>{tree.map(renderHierarchy)}</div>;
  };

  const HierarchyDetailsTable: React.FC<{ accounts: Account[] }> = ({
    accounts,
  }) => {
    const accountMap = new Map(accounts.map((acc) => [acc.id, acc]));
    const withCodes = accounts.map((account) => ({
      ...account,
      account_code: generateAccountCode(account),
    }));

    return (
      <div className="grid grid-cols-4 gap-4 font-mono text-xs">
        {withCodes.map((acc) => (
          <React.Fragment key={acc.id}>
            <div>{acc.account_code}</div>
            <div>{acc.id}</div>
            <div>{acc.parent_id}</div>
            <div>{acc.name}</div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto  mt-10 space-y-8">

{/* views */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Accordion View</h2>
        {tree.map((account) => (
          <AccountAccordion key={account.id} account={account} level={0} />
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Visual Hierarchy View</h2>
        <VisualHierarchy tree={tree} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Hierarchy with Account Codes</h2>
        <HierarchyDetailsTable accounts={accounts} />
      </div>
    </div>
  );
};

export default AccountTree;
