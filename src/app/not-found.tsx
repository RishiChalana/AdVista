import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const notFoundImage = PlaceHolderImages.find((img) => img.id === 'not-found');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
      {notFoundImage && (
        <Image
          src={notFoundImage.imageUrl}
          alt="404 Not Found"
          width={600}
          height={400}
          className="max-w-sm md:max-w-md lg:max-w-lg"
          data-ai-hint={notFoundImage.imageHint}
        />
      )}
      <h1 className="mt-8 text-4xl font-extrabold font-headline tracking-tight sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
