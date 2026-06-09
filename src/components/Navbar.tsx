import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-white/5">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg btn-hero">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>HeroFit <span className="gradient-text">AI</span></span>
          </Link>
          <div className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <Link to="/" hash="how" className="hover:text-foreground transition-colors">Como funciona</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
          <Link
            to="/create"
            className="btn-hero rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Criar plano
          </Link>
        </nav>
      </div>
    </header>
  );
}
