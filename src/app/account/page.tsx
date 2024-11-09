"use client";
import AccountList from '../components/AccountList';
import AccountTree from '../components/AccountTree';

export default function Home() {
  const handleAccountSubmit = async (account: Omit<{ id?: number; parent_id?: number | null; is_group: boolean; name: string; }, 'id'>): Promise<void> => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        throw new Error('Failed to submit account');
      }

      const result = await response.json();
      console.log('Account submitted successfully:', result);
    } catch (error) {
      console.error('Error submitting account:', error);
    }
  };

  return (
    <main>
      <h1 className="text-2xl text-center font-bold mb-4">Account Management</h1>
      <AccountList onSubmit={handleAccountSubmit} />
      <AccountTree />
    </main>
  );
}
