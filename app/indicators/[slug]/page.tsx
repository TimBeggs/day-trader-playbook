import Header from "@/components/header"
import Footer from "@/components/footer"
import IndicatorContent from "@/components/indicator-content"
import { getIndicatorBySlug } from "@/lib/indicators"
import { notFound } from "next/navigation"

export default async function IndicatorPage({ params }: { params: { slug: string } }) {
  const indicator = await getIndicatorBySlug(params.slug)

  if (!indicator) {
    notFound()
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <IndicatorContent indicator={indicator} />
      </div>
      <Footer />
    </main>
  )
}
