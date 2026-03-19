import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">TradeX</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">Sign in</Link>
            <Link href="/login" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Start selling</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-semibold text-gray-900 mb-4">
          Buy & sell wholesale <span className="text-green-600">directly, globally</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8">India's B2B wholesale marketplace</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700">Start selling free</Link>
          <Link href="/browse" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50">Browse products</Link>
        </div>
      </div>
    </div>
  )
}
