import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diffusion Simulation Lab',
  description: 'Interactive simulation of particle diffusion across a removable barrier',
}

export default function DiffusionLayout({
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