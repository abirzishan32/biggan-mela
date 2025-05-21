import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'pH Scale Interactive Lab',
  description: 'Explore acidity and alkalinity of common solutions in this interactive pH scale laboratory.',
}

export default function PhScaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="w-full min-h-screen">
      {children}
    </section>
  )
}