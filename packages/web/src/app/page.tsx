import type React from "react"
import { Navigation } from "./components"
import { PageContentWrapper } from "./components/PageContentWrapper"

interface PageProps {
  searchParams: Promise<{ spread?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 text-sm sm:text-base">
      <Navigation />
      <PageContentWrapper initialSpread={params.spread} />
    </main>
  )
}
