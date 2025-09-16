import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-groups";
import { HeroHeader } from "./header";
import UnicornScene from "unicornstudio-react/next";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-clip">
        {/* Using min-h-screen allows the section to grow on smaller devices */}
        <section className="grid isolate min-h-screen items-start">
          {/* Unicorn Scene will stretch to the full height of the section */}
          <UnicornScene
            projectId="K7xzrAoejHe2lHXqTJzm"
            lazyLoad={true}
            production={true}
            className="[grid-area:1/1] h-full w-full"
          />

          {/* All content is in a wrapper div placed in the same grid cell */}
          <div className="relative [grid-area:1/1] z-10">
            <div className="pt-24 md:pt-36">
              <div className="mx-auto max-w-7xl px-6 max-sm:px-2">
                <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                  <AnimatedGroup variants={transitionVariants}>
                    <Link
                      href="#link"
                      className="hover:bg-background/50 dark:hover:border-t-border bg-muted/50 group mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 p-1 pl-3 pr-2 shadow-md shadow-zinc-950/5 backdrop-blur-md transition-colors duration-300 dark:shadow-zinc-950 text-xs md:text-sm py-1 md:py-1.5"
                    >
                      <span className="bg-blue-400/20 text-blue-300 ring-1 ring-blue-400/30 text-[10px] md:text-xs rounded-full px-1.5 md:px-2 py-0.5">
                        Beta
                      </span>
                      <span className="text-foreground text-xs md:text-sm">
                        Search AI-Powered Network
                      </span>
                      <div className="bg-background/50 group-hover:bg-muted/50 size-5 md:size-6 overflow-hidden rounded-full duration-500">
                        <div className="flex w-8 md:w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                          <span className="flex size-5 md:size-6">
                            <ArrowRight className="m-auto size-3" />
                          </span>
                          <span className="flex size-5 md:size-6">
                            <ArrowRight className="m-auto size-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedGroup>

                  <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    className="mx-auto mt-8 max-w-5xl text-balance text-4xl font-semibold md:text-6xl lg:text-7xl   tracking-tighter"
                  >
                    Build Your Professional Network with AI
                  </TextEffect>
                  <TextEffect
                    per="line"
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    delay={0.5}
                    as="p"
                    className="mx-auto mt-8 max-w-3xl  tracking-tighter text-lg max-sm:max-w-full max-sm:text-base text-wrap"
                  >
                    Connect with like-minded professionals, discover hidden
                    opportunities, and grow your career with our intelligent
                    networking platform.
                  </TextEffect>

                  <AnimatedGroup
                    variants={{
                      container: {
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.75,
                          },
                        },
                      },
                      ...transitionVariants,
                    }}
                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="/auth/sign-up">
                        <span className="text-nowrap">Join the Network</span>
                      </Link>
                    </Button>
                    {/* <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="rounded-xl px-5"
                    >
                      <Link href="#features">
                        <span className="text-nowrap">Learn More</span>
                      </Link>
                    </Button> */}
                  </AnimatedGroup>
                </div>
              </div>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
              >
                {/* Container is now responsive and clips overflow */}
                <div className="relative mt-12 overflow-hidden px-2 sm:mt-16 md:mt-20">
                  <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 p-4 shadow-lg shadow-zinc-950/15 ring-1">
                    <Image
                      className="aspect-video w-full rounded-2xl md:aspect-[15/8]"
                      src="/mail2.png"
                      alt="app screen"
                      width="2700"
                      height="1440"
                    />
                  </div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>

        <section id="features" className="pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href="/customers"
                className="block text-sm duration-150 hover:opacity-75"
              >
                <span> Meet Our Customers</span>

                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
