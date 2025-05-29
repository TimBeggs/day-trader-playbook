export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-8 md:py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(37,99,235,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Professional NQ Day Trading Insights
        </h2>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
          Daily analysis, proven strategies, and technical indicators for serious NQ futures traders
        </p>
      </div>
    </section>
  )
}
