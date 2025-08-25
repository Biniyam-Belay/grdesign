"use client";

import { useState, useRef, FormEvent } from "react";
import { usePageTransition } from "@lib/gsapPageTransition";
import Container from "@components/layout/Container";

export default function ContactPage() {
  const pageRef = useRef<HTMLElement>(null!);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    project: "Brand Identity",
  });

  usePageTransition(pageRef);

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // This is a mock submission - in a real app, you would send this to your API
    setFormState("submitting");

    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success state
      setFormState("success");
      setFormData({
        name: "",
        email: "",
        message: "",
        project: "Brand Identity",
      });
    } catch (error) {
      setFormState("error");
    }
  };

  return (
    <main ref={pageRef} className="min-h-[70svh] bg-white">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left Column - Contact Info */}
          <div>
            <h1 className="text-4xl font-medium mb-6">Get in Touch</h1>
            <p className="text-lg text-neutral-600 mb-10">
              Interested in working together? I'd love to hear about your project. Fill out the form
              or reach out directly.
            </p>

            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-neutral-500 mb-1">Email</h2>
                <p className="text-lg">hello@example.com</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-neutral-500 mb-1">Location</h2>
                <p className="text-lg">San Francisco, CA</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-neutral-500 mb-1">Social</h2>
                <div className="flex gap-4 mt-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 hover:text-neutral-900"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://dribbble.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 hover:text-neutral-900"
                    aria-label="Dribbble"
                  >
                    Dribbble
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 hover:text-neutral-900"
                    aria-label="LinkedIn"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <div className="rounded-lg border border-neutral-200 p-6">
              {formState === "success" ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h2 className="mt-4 text-lg font-medium">Thank you!</h2>
                  <p className="mt-2 text-neutral-600">
                    Your message has been received. I'll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-6 inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="project" className="block text-sm font-medium text-neutral-700">
                      Project Type
                    </label>
                    <select
                      name="project"
                      id="project"
                      value={formData.project}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900"
                    >
                      <option value="Brand Identity">Brand Identity</option>
                      <option value="Editorial Design">Editorial Design</option>
                      <option value="Packaging Design">Packaging Design</option>
                      <option value="Digital Design">Digital Design</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-900 focus:ring-neutral-900"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className={`w-full rounded-md border border-transparent bg-neutral-900 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 ${
                        formState === "submitting" ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {formState === "submitting" ? "Sending..." : "Send Message"}
                    </button>

                    {formState === "error" && (
                      <p className="mt-2 text-sm text-red-600">
                        There was an error sending your message. Please try again.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
