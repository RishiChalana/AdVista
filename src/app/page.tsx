import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot } from 'lucide-react';

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline text-white">
              Advista
            </span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-full">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative bg-gray-900 text-white py-32 sm:py-40 lg:py-48">
       <div className="absolute inset-0 bg-black/50"></div>
       <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-[spin_20s_linear_infinite]"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-extrabold tracking-tight">
            Empower your Marketing with Advista by AdSparkx
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
            Your intelligent analytics companion for campaign optimization.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full font-semibold text-lg px-8 py-6 w-full sm:w-auto">
              <Link href="/dashboard">
                Explore Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full font-semibold text-lg px-8 py-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black w-full sm:w-auto">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const clientLogos = [
  'logo-google',
  'logo-meta',
  'logo-twitter',
  'logo-linkedin',
  'logo-stripe',
  'logo-shopify',
];

function ClientLogos() {
    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                    Trusted by the world's best companies
                </h2>
                <div className="mt-8">
                    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 lg:gap-x-12">
                        {clientLogos.map((logoId) => {
                            const logo = PlaceHolderImages.find((img) => img.id === logoId);
                            if (!logo) return null;
                            return (
                                <div key={logo.id} className="flex justify-center">
                                    <Image
                                        src={logo.imageUrl}
                                        alt={logo.description}
                                        width={120}
                                        height={40}
                                        className="object-contain"
                                        data-ai-hint={logo.imageHint}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}


function Footer() {
    const footerLinks = [
        { title: "About", href: "#" },
        { title: "Careers", href: "#" },
        { title: "Privacy Policy", href: "#" },
        { title: "Contact", href: "#" },
    ];
    return (
        <footer className="bg-card border-t">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Bot className="h-6 w-6 text-primary" />
                        <span className="text-md font-bold font-headline">
                            Advista
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-4 md:mt-0">
                        {footerLinks.map((link) => (
                            <Link key={link.title} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                                {link.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} AdSparkx, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main>
        <Hero />
        <ClientLogos />
      </main>
      <Footer />
    </div>
  );
}
