import type React from "react"
import { PageContentWrapper } from "./components/PageContentWrapper"

interface PageProps {
  searchParams: Promise<{ spread?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  
  return (
    <PageContentWrapper initialSpread={params.spread} />
  )
}
