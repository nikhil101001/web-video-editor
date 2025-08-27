import { FloatingNav } from "@/components/ui/floating-navbar";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BackgroundLines } from "@/components/ui/background-lines";
import { SparklesCore } from "@/components/ui/sparkles";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { aboutApp, features, navItems } from "@/lib/data";

export default function Home() {
  return (
    <main className="flex flex-col gap-20">
      <FloatingNav navItems={navItems} />

      {/* Hero Section with Background Lines and Sparkles */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center">
        <BackgroundLines className="absolute inset-0">
          <div className="absolute inset-0 w-full h-full z-10">
            <SparklesCore
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={70}
              className="w-full h-full"
            />
          </div>
        </BackgroundLines>

        <div className="container relative z-20 flex flex-col items-center text-center px-4">
          <div className="max-w-3xl mx-auto mb-10 space-y-6">
            <TextGenerateEffect
              words="Professional Video Editing, Simplified"
              className="text-4xl"
            />
            <TextGenerateEffect
              words="Create stunning videos with our powerful yet easy-to-use editor. Professional results without the learning curve."
              className="text-lg text-foreground/60"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button
              size="lg"
              className="px-8 py-6 rounded-full bg-blue-600 hover:bg-blue-700 "
            >
              <Link href="/editor" className="font-medium text-white">
                Start Editing Now
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 rounded-full border-blue-500 text-blue-300 hover:bg-blue-600/30"
            >
              <Link
                href="#features"
                className="font-medium dark:text-white text-black"
              >
                Explore Features
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3D Cards Showcase */}
      <section className="container mx-auto px-4 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Experience Modern Editing
        </h2>
        <p className="text-foreground/60 text-center max-w-2xl mx-auto mb-12">
          Our intuitive interface makes professional video editing accessible to
          everyone
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Timeline Editor */}
          {aboutApp.map((item, index) => (
            <CardContainer className="w-full h-full" key={index}>
              <CardBody className="dark:bg-zinc-900/90 border border-zinc-700 rounded-xl p-6 relative group/card w-full space-y-4 h-full">
                <CardItem translateZ="50" className="text-2xl font-bold">
                  {item.title}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-sm text-foreground/60 max-w-sm"
                >
                  {item.description}
                </CardItem>
                <CardItem translateZ="100" className="w-full">
                  <img
                    src={item.img}
                    height="200"
                    width="200"
                    className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl shadow-blue-500/20"
                    alt={item.title}
                  />
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4">
        <div className="rounded-3xl py-20 px-8 md:px-12 dark:bg-zinc-900 bg-zinc-100 flex flex-col justify-center ">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Powerful Features
          </h2>
          <p className="text-foreground/60 text-center max-w-2xl mx-auto mb-16">
            Everything you need to create professional videos, all in one place
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background dark:bg-zinc-800/80 border border-zinc-700 rounded-xl p-6 shadow-md hover:shadow-blue-900/30 transition-all duration-300 hover:border-blue-600/50"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Amazing Videos?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-foreground/60">
            Join thousands of creators and start crafting professional videos
            today. No complex software to learn.
          </p>

          <div className="flex items-center justify-center">
            <Link href="/editor">
              <MovingBorderButton
                className="text-nowrap cursor-pointer"
                duration={5000}
              >
                Get Started for Free
              </MovingBorderButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 dark:bg-zinc-950 border-t border-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="font-bold text-lg ">Web Video Editor</p>
              <p className="text-sm text-foreground/60">
                Professional video editing for everyone
              </p>
            </div>
            <div className="flex gap-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="text-sm text-foreground/60 hover:text-blue-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-foreground/10 text-center text-sm text-foreground/60">
            <p>
              © {new Date().getFullYear()} Web Video Editor. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
