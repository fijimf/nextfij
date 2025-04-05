import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to NextFij
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          A modern Next.js application built with Tailwind CSS and shadcn/ui.
          Start building your next project with the latest web technologies.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      <section className="py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Modern Design</CardTitle>
              <CardDescription>Built with the latest design principles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Experience a beautiful and responsive design that works across all devices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fast Performance</CardTitle>
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
              <CardTitle>Developer Friendly</CardTitle>
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
