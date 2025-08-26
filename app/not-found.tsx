import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="card p-8 max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">404</h1>
            <h2 className="text-xl font-semibold text-zinc-700 mb-4">
              ページが見つかりません
            </h2>
            <p className="text-zinc-600 mb-6">
              お探しのページは存在しないか、削除された可能性があります。
            </p>
            <Link href="/" className="btn-primary inline-block">
              トップページに戻る
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
