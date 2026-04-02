import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, Heart, MessageCircle, Home, Building2, Search, LayoutDashboard, LogOut, LogIn, BarChart3 } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { logout(); window.location.href = "/"; },
  });

  const navLinks = [
    { href: "/", label: "Início", icon: Home },
    { href: "/properties", label: "Imóveis", icon: Building2 },
    { href: "/market", label: "Mercado", icon: BarChart3 },
    { href: "/search", label: "Pesquisar", icon: Search },
    { href: "/chat", label: "La Mare_IA", icon: MessageCircle },
  ];

  const isActive = (href: string) => href === "/" ? location === "/" : location.startsWith(href);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg viewBox="0 0 100 60" className="w-9 h-9 flex-shrink-0" style={{ color: 'var(--azul)' }}>
              <path d="M 25 52 L 25 30 C 25 16 36 6 50 6 C 64 6 75 16 75 30 L 75 52" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              <circle cx="50" cy="18" r="3.5" fill="#C5A059"/>
              <path d="M 14 42 Q 32 33 50 42 T 86 42" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              <path d="M 14 51 Q 32 42 50 51 T 86 51" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.55"/>
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-lg" style={{ color: 'var(--azul)' }}>La Mare</span>
              <div className="w-full h-px" style={{ background: 'var(--dourado)', margin: '3px 0' }} />
              <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Imóveis Litorâneos</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive(href)
                    ? "bg-gold text-white"
                    : "text-foreground hover:text-gold"
                }`} style={isActive(href) ? { background: 'var(--dourado)', color: 'white' } : {}}>
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/favorites">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="w-5 h-5" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-[120px] truncate">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center gap-2 cursor-pointer">
                        <Heart className="w-4 h-4" /> Favoritos
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <LayoutDashboard className="w-4 h-4" /> Painel Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="gap-2"
                size="sm"
                style={{ background: 'var(--dourado)', color: 'white' }}
              >
                <LogIn className="w-4 h-4" /> Entrar
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white/98 backdrop-blur-md">
          <div className="container py-3 flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                <span className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive(href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}>
                  <Icon className="w-4 h-4" /> {label}
                </span>
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/favorites" onClick={() => setMobileOpen(false)}>
                  <span className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted cursor-pointer">
                    <Heart className="w-4 h-4" /> Favoritos
                  </span>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)}>
                    <span className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted cursor-pointer">
                      <LayoutDashboard className="w-4 h-4" /> Painel Admin
                    </span>
                  </Link>
                )}
                <button
                  onClick={() => { logoutMutation.mutate(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-muted"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </>
            ) : (
              <button
                onClick={() => { window.location.href = getLoginUrl(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
              >
                <LogIn className="w-4 h-4" /> Entrar
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
