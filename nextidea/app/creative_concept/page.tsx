import Link from "next/link";
import {
  Lightbulb,
  Rocket,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const blogPosts = [
  {
    title: "The Future of Creative Strategy in Digital Marketing",
    category: "Strategy",
    date: "Feb 15, 2026",
    readTime: "5 min read",
  },
  {
    title: "How to Build a Brand That Resonates with Your Audience",
    category: "Branding",
    date: "Feb 10, 2026",
    readTime: "7 min read",
  },
  {
    title: "10 Design Trends That Will Define 2026",
    category: "Design",
    date: "Feb 5, 2026",
    readTime: "4 min read",
  },
];

const portfolioItems = [
  {
    title: "TechStart Rebrand",
    category: "Branding",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "FinanceHub App",
    category: "Web Development",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    title: "HealthFirst Campaign",
    category: "Digital Marketing",
    gradient: "from-rose-500 to-pink-400",
  },
];

export default function CreativeConceptPage() {
  return (
    <div className="flex flex-col">
      <Navbar />

      <main className="pt-20">
        <section className="py-12 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href="#services"
                className="hover:text-primary transition-colors"
              >
                Services
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-zinc-900 font-medium">
                Creative Concept & Execution
              </span>
            </nav>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                Service
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6">
                Creative Concept &amp;{" "}
                <span className="text-primary">Execution</span>
              </h1>
              <p className="text-xl text-zinc-600 leading-relaxed">
                We transform bold ideas into compelling visual narratives and
                immersive digital experiences that captivate audiences and drive
                measurable results.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-zinc-900 mb-6">
                  Strategy. Creativity.{" "}
                  <span className="text-primary">Execution.</span>
                </h2>
                <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
                  Great creative work doesn&apos;t happen in isolation. It&apos;s
                  the result of strategic thinking combined with imaginative
                  execution and meticulous attention to detail.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  Our Creative Concept &amp; Execution service encompasses the
                  entire creative journey from initial brainstorming to final
                  delivery. We believe in the power of storytelling to connect
                  brands with their audiences on a deeper level.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="p-6 bg-white rounded-2xl border border-zinc-200">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                    Strategic Foundation
                  </h3>
                  <p className="text-zinc-600">
                    Every creative concept is built on a solid strategic
                    foundation of market research, audience insights, and brand
                    positioning.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-zinc-200">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                    Bold Creative Vision
                  </h3>
                  <p className="text-zinc-600">
                    Our creative team pushes boundaries to develop unique,
                    memorable concepts that stand out in a crowded marketplace.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-zinc-200">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                    Flawless Execution
                  </h3>
                  <p className="text-zinc-600">
                    We bring concepts to life with meticulous attention to
                    detail, ensuring every touchpoint delivers on the creative
                    promise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-zinc-900 mb-4">
                What Sets Us Apart
              </h2>
              <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                Our approach combines strategic rigor with creative excellence
                to deliver work that not only looks exceptional but performs
                exceptionally.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                  Innovative Thinking
                </h3>
                <p className="text-zinc-600">
                  We don&apos;t just follow trends&mdash;we set them. Our team
                  constantly explores new creative territories to deliver
                  fresh, innovative solutions.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                  Rapid Iteration
                </h3>
                <p className="text-zinc-600">
                  Our agile creative process allows for rapid prototyping and
                  iteration, ensuring we find the perfect solution efficiently.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                  Results-Driven
                </h3>
                <p className="text-zinc-600">
                  Every creative decision is guided by data and aligned with
                  measurable business objectives to ensure maximum impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-bold text-zinc-900 mb-6">
                  What We Offer
                </h2>
                <p className="text-lg text-zinc-600 mb-8">
                  Comprehensive creative services tailored to bring your vision
                  to life.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      title: "Brand Development",
                      description:
                        "Complete brand identity creation from naming to visual guidelines",
                    },
                    {
                      title: "Visual Identity Systems",
                      description:
                        "Cohesive visual language that communicates your brand essence",
                    },
                    {
                      title: "Campaign Creative",
                      description:
                        "Compelling campaign concepts that drive engagement and conversion",
                    },
                    {
                      title: "Content Creation",
                      description:
                        "High-quality visual and written content for all channels",
                    },
                    {
                      title: "Digital Experiences",
                      description:
                        "Immersive websites and interactive digital platforms",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-primary/50 transition-colors"
                    >
                      <div className="w-6 h-6 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-zinc-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-red-100 rounded-full blur-3xl" />
                <div className="relative bg-zinc-900 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                  <ul className="space-y-4">
                    {[
                      "10+ years of creative excellence",
                      "200+ successful projects delivered",
                      "Award-winning creative team",
                      "End-to-end project management",
                      "Dedicated strategic support",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                  Our Work
                </span>
                <h2 className="text-4xl font-bold text-zinc-900">
                  Related Portfolio
                </h2>
              </div>
              <Link
                href="/#portfolio"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                View All Projects
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-500`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <ArrowRight className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-white/80 text-sm font-medium mb-1">
                      {item.category}
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-zinc-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Bring Your Vision to Life?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Let&apos;s discuss how our Creative Concept &amp; Execution
              service can transform your brand and drive results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
              >
                Request a Proposal
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#portfolio"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-zinc-700 text-white font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-300"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Insights
              </span>
              <h2 className="text-4xl font-bold text-zinc-900 mb-4">
                Latest from Our Blog
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <article
                  key={index}
                  className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-zinc-100 to-zinc-200 group-hover:from-primary/10 group-hover:to-primary/5 transition-colors" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3">
                      <span className="text-primary font-medium">
                        {post.category}
                      </span>
                      <span>&bull;</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500">{post.readTime}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
