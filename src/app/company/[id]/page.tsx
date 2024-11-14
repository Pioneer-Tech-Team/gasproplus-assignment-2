'use client';
import { useEffect, useState } from 'react';
import AccountTree from '@/app/components/AccountTree';
import AccountList from '@/app/components/AccountList';

const CompanyPage = () => {
    const [id, setId] = useState<number | null>(null); // Initialize state to hold id

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathId = window.location.pathname.split('/').pop();
            setId(parseInt(pathId || '0', 10)); // Extract id from pathname
        }
    }, []); // Runs only once, after the component mounts

    const [accounts, setAccounts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`/api/accounts?companyId=${id}`)
                .then(response => response.json())
                .then(data => setAccounts(data))
                .catch(error => console.error('Error fetching accounts:', error));
        }
    }, [id]); // Only fetch when `id` changes

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAccountCreated = (newAccount: any) => {
        setAccounts(prevAccounts => (Array.isArray(prevAccounts) ? [...prevAccounts, newAccount] : [newAccount]));
        handleCloseModal();
        window.location.reload(); // Refresh the page
    };    

    const handleAccountSubmit = async (account: Omit<{ id?: number; parent_id?: number | null; is_group: boolean; name: string; }, 'id'>): Promise<void> => {
        // try {
        // return console.log('Account:', account);
            const response = await fetch('/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...account,
                    parent: account.parent_id !== undefined ? account.parent_id : null,
                    companyId: id,
                }),
            });

            console.log('Response:', response);
            if (!response.ok) {
                throw new Error('Failed to submit account');
            }

            const result = await response.json();
            console.log('Account submitted successfully:', result);
            handleAccountCreated(result);
        // } catch (error) {
        //     console.error('Error submitting account:', error);
        // }
    };

    if (id === null) {
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <div>
            <h1>Showing Accounts under Company ID - {id}</h1>
            <button 
                onClick={handleOpenModal} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Create Account
            </button>
            <AccountTree />
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl mb-4">Create New Account</h2>
                        <AccountList onSubmit={handleAccountSubmit} />
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyPage;
