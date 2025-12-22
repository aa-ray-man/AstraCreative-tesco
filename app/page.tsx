import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white text-foreground flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl w-full text-center space-y-8">
          {/* Heading */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-balance">AstraCreative</h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-2xl mx-auto text-pretty">
            Built for advertisers. Aligned with Tesco.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Button asChild size="lg" className="text-base px-8 py-6 rounded-full font-medium transition-all">
              <Link href="/editor">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-base text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Team VisionFlow | mohindruaryaman@gmail.com</p>
      </footer>
    </div>
  )
}
