import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="bg-charcoal-950 min-h-screen flex items-center justify-center">
      <Container className="text-center">
        <span className="font-mono text-8xl md:text-9xl text-gold-500/20 font-bold block mb-8">
          404
        </span>
        <h1 className="font-heading text-2xl md:text-3xl tracking-[0.1em] uppercase text-cream-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-charcoal-400 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button href="/">Back to Home</Button>
          <Button href="/properties" variant="ghost">View Properties</Button>
        </div>
      </Container>
    </section>
  )
}
