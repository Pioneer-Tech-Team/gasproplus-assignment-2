"use client"
import CompanyList from '../components/CompanyList';

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl text-center font-bold mb-4">Company Management</h1>
      <CompanyList />
    </main>
  );
}
