import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";
import {SortAsc, Shield, ArrowUpAZ, Calendar, Network, SquareSigma, ChartNetwork} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Subtle basketball court pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, currentColor 2px, transparent 2px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <section className="py-6 text-center animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Image
              src="/tedmorgan2.jpg"
              alt="Fridge Rules"
              width={250}
              height={250}
              className="rounded-full object-cover shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
            />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-md scale-110 opacity-50 animate-pulse"></div>
            {/* Border glow */}
            <div className="absolute inset-0 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-background"></div>
          </div>
        </div>
        <TypographyH1 className="mb-4">
          Welcome to DeepFij
        </TypographyH1>
        <TypographyLead className="mb-6 max-w-2xl mx-auto">
          Your one stop shop for naïve and primitive college basketball statistical analysis.
        </TypographyLead>
      </section>

      <section className="py-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Teams</CardTitle>
              <CardDescription>Team schedules, records, and more.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/teams" className="block">
                  <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                    <ArrowUpAZ className="mr-2 h-4 w-4" />
                    Teams A-Z
                  </Button>
                </Link>
                <Link href="/conferences" className="block">
                  <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                    <Shield className="mr-2 h-4 w-4" />
                    Conferences
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Games</CardTitle>
              <CardDescription>Game schedules and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/games" className="block">
                  <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Games by Date
                  </Button>
                </Link>
                <Link href="/games/tournament" className="block">
                  <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                    <Network className="mr-2 h-4 w-4" />
                    NCAA Tournament
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
              <CardDescription>Statistical insights and models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/statistics" className="block">
                  <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                    <SquareSigma className="mr-2 h-4 w-4" />
                    Computed Statistics
                  </Button>
                </Link>
                <Link href="/models" className="block">
                  <Button variant="outline" className="w-full transition-all hover:bg-primary hover:text-primary-foreground">
                    <ChartNetwork className="mr-2 h-4 w-4" />
                    ML Prediction Models
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>
      </div>
    </div>
  );
}
