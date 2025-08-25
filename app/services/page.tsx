"use client";

import { useRef } from "react";
import Image from "next/image";
import { usePageTransition } from "@lib/gsapPageTransition";
import Container from "@components/layout/Container";
import SplitText from "@components/motion/SplitText";
import Link from "next/link";

export default function ServicesPage() {
  const pageRef = useRef<HTMLElement>(null!);
  usePageTransition(pageRef);

  return (
    <main ref={pageRef} className="min-h-[70svh] bg-white">
      <Container className="py-16">
        {/* Services Hero */}
        <div className="max-w-3xl">
          <SplitText as="h1" className="text-4xl sm:text-5xl font-medium mb-6" trigger={true}>
            <span>Design services that</span>
            <span>elevate your brand</span>
          </SplitText>
          <p className="text-lg text-neutral-600">
            I offer a range of graphic design services focused on creating impactful visual
            experiences that communicate your brand's unique story.
          </p>
        </div>

        {/* Services Grid */}
        <section className="mt-20">
          <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
            <div>
              <div className="mb-4 rounded-lg bg-neutral-100 p-4 inline-block">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-neutral-800"
                >
                  <path
                    d="M4 12H20M12 4V20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-medium mb-4">Brand Identity</h2>
              <p className="text-neutral-600 mb-4">
                Develop a cohesive visual system that expresses your brand's personality across all
                touchpoints.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Logo design and refinement</li>
                <li>• Visual identity systems</li>
                <li>• Brand guidelines</li>
                <li>• Stationery and collateral</li>
              </ul>
            </div>

            <div>
              <div className="mb-4 rounded-lg bg-neutral-100 p-4 inline-block">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-neutral-800"
                >
                  <path
                    d="M4 7H20M4 12H20M4 17H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-medium mb-4">Editorial Design</h2>
              <p className="text-neutral-600 mb-4">
                Create engaging layouts that enhance content through thoughtful typography and
                visual hierarchy.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Books and publications</li>
                <li>• Annual reports</li>
                <li>• Magazines and catalogs</li>
                <li>• Digital editorial experiences</li>
              </ul>
            </div>

            <div>
              <div className="mb-4 rounded-lg bg-neutral-100 p-4 inline-block">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-neutral-800"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-medium mb-4">Packaging Design</h2>
              <p className="text-neutral-600 mb-4">
                Develop packaging that stands out on shelves while effectively communicating your
                product's value.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Product packaging</li>
                <li>• Label design</li>
                <li>• Structural considerations</li>
                <li>• Packaging systems</li>
              </ul>
            </div>

            <div>
              <div className="mb-4 rounded-lg bg-neutral-100 p-4 inline-block">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-neutral-800"
                >
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium mb-4">Digital Design</h2>
              <p className="text-neutral-600 mb-4">
                Translate brand identity into digital experiences that engage users across
                platforms.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Web design</li>
                <li>• UI components</li>
                <li>• Digital assets</li>
                <li>• Social media templates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="mt-28 max-w-4xl mx-auto">
          <h2 className="text-3xl font-medium mb-10 text-center">Design Process</h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-neutral-900 text-lg font-medium">
                1
              </div>
              <h3 className="text-xl font-medium mb-2">Discovery</h3>
              <p className="text-sm text-neutral-600">
                Understanding your goals, audience, and market positioning.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-neutral-900 text-lg font-medium">
                2
              </div>
              <h3 className="text-xl font-medium mb-2">Strategy</h3>
              <p className="text-sm text-neutral-600">
                Developing a creative approach that aligns with your objectives.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-neutral-900 text-lg font-medium">
                3
              </div>
              <h3 className="text-xl font-medium mb-2">Design</h3>
              <p className="text-sm text-neutral-600">
                Creating and refining visual solutions through an iterative process.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-neutral-900 text-lg font-medium">
                4
              </div>
              <h3 className="text-xl font-medium mb-2">Delivery</h3>
              <p className="text-sm text-neutral-600">
                Finalizing assets and providing guidance for implementation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-28 py-16 bg-neutral-100 rounded-lg">
          <div className="max-w-2xl mx-auto text-center px-6">
            <h2 className="text-3xl font-medium mb-4">Ready to start a project?</h2>
            <p className="mb-8 text-neutral-600">
              Let's discuss how I can help bring your vision to life.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 px-6 py-3 text-sm font-medium text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Get in touch
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
