import VoucherList from '../components/VoucherList';

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl text-center font-bold mb-4">Voucher Management</h1>
      <VoucherList />
    </main>
  );
}
