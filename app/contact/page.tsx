import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactForm from "@/components/contact-form"

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about NQ trading strategies or need help with technical analysis? I'm here to help fellow
            traders improve their market understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trading Focus</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">NQ Futures Trading</h3>
                  <p className="text-gray-600">
                    Specialized focus on Nasdaq-100 futures with emphasis on intraday momentum and breakout strategies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Market Internals</h3>
                  <p className="text-gray-600">
                    Deep analysis of NYSE TICK, advance/decline data, and volume participation for market sentiment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <path d="M3 3v18h18" />
                    <path d="M7 12l4-4 4 4 6-6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Analysis</h3>
                  <p className="text-gray-600">
                    Professional-grade technical analysis with focus on price action, support/resistance, and momentum
                    indicators.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600 text-sm">
                I typically respond to messages within 24-48 hours during market days. For urgent trading questions,
                please note the time-sensitive nature in your message.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
