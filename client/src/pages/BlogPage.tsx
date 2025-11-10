import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function BlogPage() {
  const { t, language } = useLanguage();

  // Mock blog posts - will be fetched from API in backend integration
  const posts = [
    {
      id: "1",
      titleFr: "Les tendances du développement web en 2024",
      titleEn: "Web Development Trends in 2024",
      excerptFr: "Découvrez les technologies et pratiques qui façonnent le futur du web.",
      excerptEn: "Discover the technologies and practices shaping the future of the web.",
      slug: "web-dev-trends-2024",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      titleFr: "Optimiser les performances de votre application React",
      titleEn: "Optimizing Your React Application Performance",
      excerptFr: "Techniques avancées pour améliorer la vitesse et l'efficacité de vos apps React.",
      excerptEn: "Advanced techniques to improve the speed and efficiency of your React apps.",
      slug: "react-performance-optimization",
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      titleFr: "Introduction à l'architecture serverless",
      titleEn: "Introduction to Serverless Architecture",
      excerptFr: "Comprendre les avantages et les défis de l'architecture sans serveur.",
      excerptEn: "Understanding the benefits and challenges of serverless architecture.",
      slug: "serverless-architecture-intro",
      createdAt: "2024-01-05",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4">
              {t("Blog & Actualités", "Blog & News")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(
                "Articles, tutoriels et réflexions sur le développement web.",
                "Articles, tutorials and thoughts on web development."
              )}
            </p>
          </div>

          <div className="space-y-8">
            {posts.map((post) => (
              <Card key={post.id} className="p-6 hover-elevate transition-all" data-testid={`post-${post.id}`}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <time>{new Date(post.createdAt).toLocaleDateString(language)}</time>
                </div>

                <h2 className="text-2xl font-heading font-bold mb-3">
                  {language === "fr" ? post.titleFr : post.titleEn}
                </h2>

                <p className="text-muted-foreground mb-4">
                  {language === "fr" ? post.excerptFr : post.excerptEn}
                </p>

                <Button variant="outline" asChild data-testid={`button-read-${post.id}`}>
                  <a href={`/blog/${post.slug}`}>
                    {t("Lire la suite", "Read more")}
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
