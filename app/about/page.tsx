"use client";

import { useRef } from "react";
import Image from "next/image";
import { usePageTransition } from "@lib/gsapPageTransition";
import Container from "@components/layout/Container";
import SplitText from "@components/motion/SplitText";

export default function AboutPage() {
  const pageRef = useRef<HTMLElement>(null!);
  usePageTransition(pageRef);

  return (
    <main ref={pageRef} className="min-h-[70svh] bg-white">
      <Container className="py-16">
        {/* About Hero */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SplitText as="h1" className="text-4xl sm:text-5xl font-medium mb-6" trigger={true}>
              About the designer
            </SplitText>
            <p className="text-lg text-neutral-600 mb-4">
              I'm a graphic designer with over a decade of experience crafting meaningful visual
              identities, editorial layouts, and packaging designs that connect with audiences.
            </p>
            <p className="text-neutral-600">
              My approach balances aesthetic refinement with functional clarity, creating designs
              that communicate effectively while maintaining visual elegance.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100">
            {/* Placeholder for designer image */}
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-500">
              Portrait Image
            </div>
          </div>
        </div>

        {/* Values Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-medium mb-10">Design Values</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-xl font-medium mb-3">Purposeful Simplicity</h3>
              <p className="text-neutral-600">
                Every element serves a purpose. I believe in reduction to the essential, creating
                space for what truly matters.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3">Typographic Precision</h3>
              <p className="text-neutral-600">
                Typography forms the foundation of good design. I prioritize readability, hierarchy,
                and expressive type choices.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3">Thoughtful Motion</h3>
              <p className="text-neutral-600">
                Movement should enhance understanding, not distract. Subtle animations add dimension
                and guide attention.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-medium mb-10">Experience</h2>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="text-sm text-neutral-500">2020—Present</div>
              <div className="md:col-span-3">
                <h3 className="text-xl font-medium">Independent Designer</h3>
                <p className="mt-2 text-neutral-600">
                  Working directly with clients to create meaningful brand experiences, from
                  strategy to execution.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="text-sm text-neutral-500">2017—2020</div>
              <div className="md:col-span-3">
                <h3 className="text-xl font-medium">Senior Designer, Studio Name</h3>
                <p className="mt-2 text-neutral-600">
                  Led brand identity and packaging projects for clients in fashion, technology, and
                  consumer goods sectors.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="text-sm text-neutral-500">2015—2017</div>
              <div className="md:col-span-3">
                <h3 className="text-xl font-medium">Designer, Agency Name</h3>
                <p className="mt-2 text-neutral-600">
                  Developed visual concepts and layouts for print and digital campaigns.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
