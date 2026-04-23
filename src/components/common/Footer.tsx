import { Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 xl:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold gradient-text">PoetVerse</span>
            </div>
            <p className="text-muted-foreground">
              A multi-language poetry platform celebrating the beauty of words across Urdu, Hindi, English, and Bengali.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Languages
            </h3>
            <div className="text-muted-foreground space-y-2">
              <p>Urdu • اردو</p>
              <p>Hindi • हिन्दी</p>
              <p>English</p>
              <p>Bengali • বাংলা</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Poetry Forms
            </h3>
            <div className="text-muted-foreground space-y-2">
              <p>Shayari • Ghazal • Nazm</p>
              <p>Poems • Songs • Couplets</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>{currentYear} PoetVerse</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;