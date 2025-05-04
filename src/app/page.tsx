import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-20 text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/tedmorgan2.jpg"
            alt="Fridge Rules"
            width={300}
            height={300}
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to DeepFij
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          You&apos;re one stop shop for naïve and primitive college basketball statistical analysis.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg">Get Started</Button>
        </div>
      </section>

      <section className="py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Teams</CardTitle>
              <CardDescription>Team schedules, records, and more.</CardDescription>
            </CardHeader>
            <CardContent>
              
              <Link href="/teams">
                <Button variant="outline" className="w-full">
                  View Teams
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Games</CardTitle>
              <CardDescription>Optimized for speed and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lightning-fast page loads and smooth transitions for the best user experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
              <CardDescription>Built for developers, by developers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive documentation and intuitive APIs make development a breeze.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
