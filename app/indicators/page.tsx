import Header from "@/components/header"
import Footer from "@/components/footer"
import IndicatorGrid from "@/components/indicator-grid"
import { getIndicators } from "@/lib/indicators"

export default async function IndicatorsPage() {
  const indicators = await getIndicators({ status: "published" })

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(37,99,235,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Professional Trading Indicators
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Master the market breadth and sentiment indicators used in professional NQ futures analysis. Learn how each
            indicator works and how to apply them in your daily trading.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow">
        <IndicatorGrid indicators={indicators} />

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-12 text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Master These Indicators in Your Trading</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            See how these professional indicators are applied in real-time NQ analysis through daily market breakdowns
            and trading setups.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
            View Daily Analysis
          </a>
        </div>
      </div>

      <Footer />
    </main>
  )
}
