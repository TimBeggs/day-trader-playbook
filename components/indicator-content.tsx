import type { Indicator } from "@/lib/types"

interface IndicatorContentProps {
  indicator: Indicator
}

export default function IndicatorContent({ indicator }: IndicatorContentProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-amber-100 text-amber-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <a href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
          Home
        </a>
        <span className="mx-2 text-gray-400">›</span>
        <a href="/indicators" className="text-gray-500 hover:text-blue-600 transition-colors">
          Indicators
        </a>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-700">{indicator.name}</span>
      </nav>

      {/* Indicator Header */}
      <header className="bg-white rounded-xl shadow border border-gray-100 p-10 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {indicator.categories.map((category, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {category}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{indicator.name}</h1>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">{indicator.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className={`text-lg font-bold ${getComplexityColor(indicator.complexity).split(" ")[1]}`}>
              {indicator.complexity.charAt(0).toUpperCase() + indicator.complexity.slice(1)}
            </div>
            <div className="text-sm text-gray-500">Complexity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">Real-time</div>
            <div className="text-sm text-gray-500">Updates</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">NYSE</div>
            <div className="text-sm text-gray-500">Data Source</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">5 min</div>
            <div className="text-sm text-gray-500">Read Time</div>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">📋 What You'll Learn</h4>
        <ul className="space-y-2">
          <li>
            <a href="#overview" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              What is the {indicator.name}?
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              How It Works & Calculation
            </a>
          </li>
          <li>
            <a href="#applications" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              NQ Trading Applications
            </a>
          </li>
          <li>
            <a href="#examples" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              Real Trading Examples
            </a>
          </li>
        </ul>
      </div>

      {/* Indicator Content */}
      <article className="bg-white rounded-xl shadow border border-gray-100 p-10">
        <div dangerouslySetInnerHTML={{ __html: indicator.content }} />
      </article>
    </div>
  )
}
