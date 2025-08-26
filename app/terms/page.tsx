import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-zinc-900 mb-6">利用規約</h1>

          <div className="prose prose-zinc max-w-none space-y-4">
            <p className="text-zinc-600">
              この掲示板を利用するにあたり、以下の規約をお読みいただき、同意の上でご利用ください。
            </p>

            <h2 className="text-lg font-semibold text-zinc-900 mt-6">
              1. サービスの利用
            </h2>
            <p className="text-zinc-600">
              本サービスは匿名での投稿が可能な掲示板システムです。適切な利用を心がけてください。
            </p>

            <h2 className="text-lg font-semibold text-zinc-900 mt-6">
              2. 禁止事項
            </h2>
            <ul className="text-zinc-600 space-y-2 list-disc list-inside">
              <li>他者への誹謗中傷や嫌がらせ</li>
              <li>個人情報の投稿や公開</li>
              <li>著作権を侵害するコンテンツの投稿</li>
              <li>スパムや宣伝目的の投稿</li>
              <li>違法行為に関する投稿</li>
            </ul>

            <h2 className="text-lg font-semibold text-zinc-900 mt-6">
              3. 免責事項
            </h2>
            <p className="text-zinc-600">
              本サービスの利用により生じた損害について、当方は責任を負いかねます。
            </p>

            <p className="text-zinc-500 text-sm mt-8">
              最終更新日: 2025年8月26日
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
