import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-600">
            &copy; 2025 バイブコーディング掲示板
          </div>

          <nav className="flex gap-6">
            <Link
              href="/terms"
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              プライバシーポリシー
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
