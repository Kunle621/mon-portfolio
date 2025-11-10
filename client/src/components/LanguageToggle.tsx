import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 border rounded-md p-1">
      <Button
        size="sm"
        variant={language === "fr" ? "default" : "ghost"}
        onClick={() => setLanguage("fr")}
        className="h-8 px-3"
        data-testid="button-language-fr"
      >
        FR
      </Button>
      <Button
        size="sm"
        variant={language === "en" ? "default" : "ghost"}
        onClick={() => setLanguage("en")}
        className="h-8 px-3"
        data-testid="button-language-en"
      >
        EN
      </Button>
    </div>
  );
}
