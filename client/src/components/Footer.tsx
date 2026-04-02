import { Link } from "wouter";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-white" style={{ background: 'var(--azul)' }}>
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 100 60" className="w-10 h-10 flex-shrink-0" style={{ color: 'white' }}>
                <path d="M 25 52 L 25 30 C 25 16 36 6 50 6 C 64 6 75 16 75 30 L 75 52" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                <circle cx="50" cy="18" r="3.5" fill="#C5A059"/>
                <path d="M 14 42 Q 32 33 50 42 T 86 42" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                <path d="M 14 51 Q 32 42 50 51 T 86 51" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.55"/>
              </svg>
              <div>
                <div className="font-serif font-bold text-lg">La Mare</div>
                <div className="w-full h-px" style={{ background: 'var(--dourado)', margin: '3px 0' }} />
                <div className="text-[10px] text-white/60 uppercase tracking-widest">Imóveis Litorâneos</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Especialistas em propriedades litorâneas premium. Encontre o seu imóvel à beira-mar com análise de investimento completa.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://instagram.com/lamare_imobiliaria" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors" style={{ background: 'rgba(197,160,89,0.2)' }}>
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/lamareimobiliaria" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors" style={{ background: 'rgba(197,160,89,0.2)' }}>
                <Facebook className="w-4 h-4" />
              </a>

            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--dourado)' }}>Plataforma</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/properties", label: "Todos os Imóveis" },
                { href: "/search", label: "Pesquisa Avançada" },
                { href: "/favorites", label: "Meus Favoritos" },
                { href: "/chat", label: "La Mare_IA" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cidades */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--dourado)' }}>Destinos</h4>
            <ul className="space-y-2.5">
              {["Florianópolis", "Balneário Camboriú", "Búzios", "Angra dos Reis", "Ilhabela", "Maceió"].map((city) => (
                <li key={city}>
                  <Link href={`/properties?city=${encodeURIComponent(city)}`}>
                    <span className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer">{city}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--dourado)' }}>Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--dourado)' }} />
                <span>Trindade<br />Florianópolis, SC</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/60 text-sm">
                <Phone className="w-4 h-4 shrink-0" style={{ color: 'var(--dourado)' }} />
                <a href="https://wa.me/5548988284152" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">(48) 98828-4152</a>
              </li>
              <li className="flex items-center gap-2.5 text-white/60 text-sm">
                <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--dourado)' }} />
                <a href="mailto:lamareimobiliaria@gmail.com" className="hover:text-white transition-colors">lamareimobiliaria@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
          <p className="text-white/40 text-xs">© 2025 La Mare Imóveis Litorâneos. Todos os direitos reservados.</p>
          <p className="text-white/40 text-xs">CRECI: 00000-F · CNPJ: 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}
