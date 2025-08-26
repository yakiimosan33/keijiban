import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-zinc-900 mb-6">
            プライバシーポリシー
          </h1>

          <div className="prose prose-zinc max-w-none space-y-4">
            <p className="text-zinc-600">
              当掲示板における個人情報の取り扱いについて説明いたします。
            </p>

            <h2 className="text-lg font-semibold text-zinc-900 mt-6">
              1. 収集する情報
            </h2>
            <p className="text-zinc-600">
              本サービスでは以下の情報を取得する場合があります：
            </p>
            <ul className="text-zinc-600 space-y-2 list-disc list-inside">
              <li>投稿内容（タイトル、本文、コメント）</li>
              <li>アクセス日時</li>
              <li>IPアドレス（ハッシュ化して保存）</li>
            </ul>

            <h2 className="text-lg font-semibold text-zinc-900 mt-6">
              2. 情報の利用目的
            </h2>
            <p className="text-zinc-600">
              収集した情報は以下の目的で利用します：
            </p>
            <ul className="text-zinc-600 space-y-2 list-disc list-inside">
              <li>サービスの提供・運営</li>
              <li>不正利用の防止</li>
              <li>サービスの改善</li>
            </ul>

            <h2 className="text-lg font-semibold text-zinc-900 mt-6">
              3. 情報の管理
            </h2>
            <p className="text-zinc-600">
              個人情報は適切に管理し、第三者への提供は行いません。
              ただし、法令に基づく開示請求があった場合はこの限りではありません。
            </p>

            <h2 className="text-lg font-semibold text-zinc-900 mt-6">
              4. Cookieについて
            </h2>
            <p className="text-zinc-600">
              本サービスでは、サービス改善のためにCookieを使用する場合があります。
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
