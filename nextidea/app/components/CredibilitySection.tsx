import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah Mitchell",
    role: "CMO",
    company: "TechVentures Inc.",
    text: "They transformed our digital presence completely. Our leads increased by 300% within 6 months.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Founder",
    company: "StartUp Labs",
    text: "Exceptional creativity combined with flawless execution. They truly understand how to build brands that matter.",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Director of Marketing",
    company: "Global Solutions",
    text: "The team delivered beyond our expectations. Strategic, professional, and incredibly talented.",
    rating: 5,
  },
];

export default function CredibilitySection() {
  return (
    <section className="py-24 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">
                Trusted by Industry Leaders
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              We Don&apos;t Just Create.
              <span className="text-primary"> We Transform.</span>
            </h2>

            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              As a full-service digital agency, we partner with ambitious brands
              to craft compelling narratives, design memorable experiences, and
              build digital products that drive measurable business growth.
            </p>

            <p className="text-zinc-500 mb-8">
              With over 10 years of experience and 200+ successful projects,
              we&apos;ve helped startups and Fortune 500 companies alike
              achieve their digital ambitions.
            </p>

            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-4xl font-bold text-primary">200+</div>
                <div className="text-zinc-500">Projects Delivered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">98%</div>
                <div className="text-zinc-500">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">10+</div>
                <div className="text-zinc-500">Years Experience</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
              <Quote className="w-12 h-12 text-primary/30 mb-6" />
              
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className={`${index > 0 ? "mt-8 pt-8 border-t border-zinc-700/50" : ""}`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-primary fill-primary"
                      />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-4 italic">&ldquo;{review.text}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-white">{review.name}</div>
                    <div className="text-sm text-zinc-500">
                      {review.role}, {review.company}
                    </div>
                  </div>
                </div>
              ))}

              <div className="absolute -bottom-3 -right-3 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 fill-white" />
                4.9/5 Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
