import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-20 text-center animate-fade-in">
        <div className="mb-8 flex justify-center">
          <Image
            src="/tedmorgan2.jpg"
            alt="Fridge Rules"
            width={300}
            height={300}
            className="rounded-full object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
        <TypographyH1 className="mb-6">
          Welcome to DeepFij
        </TypographyH1>
        <TypographyLead className="mb-10 max-w-2xl mx-auto">
          Your one stop shop for naïve and primitive college basketball statistical analysis.
        </TypographyLead>
        <div className="flex items-center justify-center gap-x-6">
          <Button size="lg" className="animate-pulse-slow">Get Started</Button>
        </div>
      </section>

      <section className="py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Teams</CardTitle>
              <CardDescription>Team schedules, records, and more.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/teams">
                <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                  View Teams
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Games</CardTitle>
              <CardDescription>Game schedules and results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse game schedules, results, and tournament information.
              </p>
              <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                View Games
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
              <CardDescription>Statistical insights and models</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive statistical analysis and predictive models for basketball.
              </p>
              <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                View Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
