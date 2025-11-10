import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { testimonialsAPI } from "@/lib/api";
import client1Image from "@assets/generated_images/Female_client_testimonial_photo_921cb9be.png";
import client2Image from "@assets/generated_images/Male_client_testimonial_photo_73d4bcaa.png";
import client3Image from "@assets/generated_images/Young_entrepreneur_testimonial_photo_5c4fda99.png";

export function Testimonials() {
  const { t, language } = useLanguage();

  const { data: fetchedTestimonials, isLoading } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: testimonialsAPI.getAll,
  });

  const demoTestimonials = [
    {
      id: "1",
      clientName: "Sophie Martin",
      clientRole: "CEO, TechStart",
      clientPhoto: client1Image,
      testimonialFr: "Excellent travail ! L'application est exactement ce que nous voulions. Communication parfaite et délais respectés.",
      testimonialEn: "Excellent work! The application is exactly what we wanted. Perfect communication and deadlines met.",
      rating: 5,
    },
    {
      id: "2",
      clientName: "Marc Dubois",
      clientRole: "Founder, EcoShop",
      clientPhoto: client2Image,
      testimonialFr: "Un développeur très professionnel avec une grande expertise technique. Je recommande vivement ses services.",
      testimonialEn: "A very professional developer with great technical expertise. I highly recommend his services.",
      rating: 5,
    },
    {
      id: "3",
      clientName: "Emma Laurent",
      clientRole: "Marketing Director",
      clientPhoto: client3Image,
      testimonialFr: "Collaboration fluide et résultat au-delà de nos attentes. Le site est magnifique et performant !",
      testimonialEn: "Smooth collaboration and result beyond our expectations. The website is beautiful and performant!",
      rating: 5,
    },
  ];

  const testimonials = (fetchedTestimonials && fetchedTestimonials.length > 0) ? fetchedTestimonials : demoTestimonials;

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 md:py-24 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              {t("Témoignages", "Testimonials")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-5 h-5 bg-muted rounded" />
                  ))}
                </div>
                <div className="h-20 bg-muted rounded mb-6" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 md:py-24 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {t("Témoignages", "Testimonials")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Ce que mes clients disent de notre collaboration.",
              "What my clients say about our collaboration."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6" data-testid={`testimonial-${testimonial.id}`}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 italic">
                "{language === "fr" ? testimonial.testimonialFr : testimonial.testimonialEn}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.clientPhoto}
                  alt={testimonial.clientName}
                  className="w-12 h-12 rounded-full object-cover"
                  data-testid={`img-client-${testimonial.id}`}
                />
                <div>
                  <div className="font-semibold">{testimonial.clientName}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.clientRole}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
