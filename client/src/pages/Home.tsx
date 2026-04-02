import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, Waves } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { data: properties } = trpc.properties.list.useQuery({ limit: 12, featured: true });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-areia text-azul" style={{ background: 'var(--areia)', color: 'var(--azul)' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero relative h-screen min-h-[680px] flex items-end overflow-hidden pt-20">
        {/* Background Image with Animation */}
        <div
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            animation: 'slow-zoom 22s ease-in-out infinite alternate',
          }}
        />

        {/* Overlay Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, rgba(10,37,64,.08) 0%, rgba(10,37,64,.2) 40%, rgba(10,37,64,.78) 100%)',
          }}
        />

        {/* Frame Border */}
        <div
          className="absolute inset-5 pointer-events-none"
          style={{
            border: '1px solid rgba(197,160,89,.22)',
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-8 pb-24">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-3 mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--dourado)' }}
          >
            <div className="w-6 h-px" style={{ background: 'var(--dourado)' }} />
            Propriedades Litorâneas Premium
          </div>

          {/* Main Heading */}
          <h1
            className="font-serif text-6xl lg:text-7xl font-normal leading-tight mb-7 text-white"
            style={{ fontFamily: 'var(--serif)', letterSpacing: '-0.01em' }}
          >
            Sua janela<br />
            para o mar.
          </h1>

          {/* Description */}
          <p className="text-lg text-white/75 max-w-md leading-relaxed mb-12 font-light">
            Unimos expertise imobiliária com inteligência artificial para encontrar seu refúgio perfeito nas melhores cidades litorâneas do Brasil.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setLocation("/properties")}
              className="px-10 py-4 text-white font-semibold text-sm uppercase tracking-widest transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: 'var(--dourado)' }}
            >
              Explorar Imóveis
            </button>
            <button
              onClick={() => setLocation("/chat")}
              className="px-10 py-4 text-white font-medium text-sm uppercase tracking-widest border border-white/40 bg-transparent transition-all hover:bg-white/10 hover:border-white/75"
            >
              Consultor IA
            </button>
          </div>
        </div>

        {/* Hero Strip Stats */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-3 border-t"
          style={{
            borderColor: 'rgba(197,160,89,.18)',
            background: 'rgba(10,37,64,.52)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="px-8 py-4 border-r" style={{ borderColor: 'rgba(197,160,89,.1)' }}>
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--dourado)' }}>
              Propriedades
            </div>
            <div className="text-white font-serif text-lg mt-1">500+</div>
          </div>
          <div className="px-8 py-4 border-r" style={{ borderColor: 'rgba(197,160,89,.1)' }}>
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--dourado)' }}>
              Cidades
            </div>
            <div className="text-white font-serif text-lg mt-1">12+</div>
          </div>
          <div className="px-8 py-4">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--dourado)' }}>
              Satisfação
            </div>
            <div className="text-white font-serif text-lg mt-1">98%</div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      {properties && properties.items.length > 0 && (
        <section className="py-24 px-8" style={{ background: 'var(--areia)' }}>
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="flex justify-between items-end mb-14 gap-8 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-3 mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--dourado)' }}>
                  <div className="w-5 h-px" style={{ background: 'var(--dourado)' }} />
                  Seleção Premium
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl font-normal" style={{ letterSpacing: '-0.01em' }}>
                  Propriedades em <em className="italic" style={{ color: 'var(--muted)' }}>Destaque</em>
                </h2>
              </div>
              <p className="text-sm text-muted max-w-xs text-right font-light leading-relaxed">
                Cada propriedade é cuidadosamente selecionada por nosso time de especialistas.
              </p>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5" style={{ background: 'var(--line)' }}>
              {properties.items.slice(0, 6).map((prop) => (
                <div
                  key={prop.id}
                  className="group relative overflow-hidden cursor-pointer bg-white"
                  onClick={() => setLocation(`/property/${prop.id}`)}
                >
                  {/* Property Image */}
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                      src={prop.coverImage || `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=667&fit=crop`}
                      alt={prop.title}
                      className="w-full h-full object-cover transition-transform duration-900 group-hover:scale-106"
                    />

                    {/* Frame Border */}
                    <div
                      className="absolute inset-3 pointer-events-none border transition-colors duration-400"
                      style={{
                        borderColor: 'rgba(197,160,89,0)',
                        transition: 'border-color 0.4s',
                      }}
                    />

                    {/* Overlay Gradient */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(10,37,64,.88) 0%, transparent 55%)',
                      }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-7">
                      <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--dourado)', marginBottom: '0.4rem' }}>
                        {prop.city}
                      </div>
                      <h3 className="font-serif text-2xl font-normal text-white leading-tight mb-3">
                        {prop.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/65 font-light">
                          {prop.bedrooms} quartos · {prop.area} m²
                        </span>
                        <button
                          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-2 transition-all opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0"
                          style={{
                            background: 'rgba(197,160,89,.18)',
                            border: '1px solid rgba(197,160,89,.5)',
                            color: 'var(--dourado)',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/properties/${prop.id}`);
                          }}
                        >
                          Analisar <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => setLocation("/properties")}
                className="px-8 py-3 text-sm font-semibold uppercase tracking-widest transition-all"
                style={{
                  background: 'var(--azul)',
                  color: 'white',
                }}
              >
                Ver Todas as Propriedades
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SOBRE SECTION */}
      <section className="py-24 px-8" style={{ background: 'var(--areia)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column */}
            <div>
              <h2 className="font-serif text-4xl lg:text-5xl font-normal mb-8" style={{ letterSpacing: '-0.01em', color: 'var(--azul)' }}>
                A <em className="italic" style={{ color: 'var(--azul)' }}>La Mare</em>
              </h2>
              <div className="space-y-4 mb-8">
                <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--azul)' }}>
                  <strong>Expertise humana, amplificada por inteligência.</strong>
                </p>
                <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--azul)' }}>
                  A La Mare nasceu da vontade de tornar a busca pelo imóvel certo uma experiência mais clara, mais honesta e mais humana.
                </p>
                <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--azul)' }}>
                  Combinamos o conhecimento do corretor com a precisão da inteligência artificial — para que cada cliente chegue à decisão certa com mais segurança e menos ruído.
                </p>
              </div>

              {/* Diferenciais Grid */}
              <div className="grid grid-cols-2 gap-0.5 mt-8" style={{ background: 'var(--line)' }}>
                <div className="p-6" style={{ background: 'var(--areia)' }}>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--azul)' }}>
                    La Mare IA
                  </div>
                  <p className="text-xs leading-relaxed font-light" style={{ color: 'var(--azul)' }}>
                    Filtros inteligentes, insights sobre valorização, m² e amenidades.
                  </p>
                </div>
                <div className="p-6" style={{ background: 'var(--areia)' }}>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--azul)' }}>
                    Rede Litorânea
                  </div>
                  <p className="text-xs leading-relaxed font-light" style={{ color: 'var(--azul)' }}>
                    Cidades costeiras de norte a sul com alto potencial.
                  </p>
                </div>
                <div className="p-6" style={{ background: 'var(--areia)' }}>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--azul)' }}>
                    Análise Bancária
                  </div>
                  <p className="text-xs leading-relaxed font-light" style={{ color: 'var(--azul)' }}>
                    Taxas, financiamento e previsões de retorno atualizadas.
                  </p>
                </div>
                <div className="p-6" style={{ background: 'var(--areia)' }}>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--azul)' }}>
                    Curadoria
                  </div>
                  <p className="text-xs leading-relaxed font-light" style={{ color: 'var(--azul)' }}>
                    Apenas imóveis com vista mar e potencial comprovado.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Pilares */}
            <div className="space-y-8 pl-0 lg:pl-12 border-l-0 lg:border-l" style={{ borderColor: 'var(--line)' }}>
              <div className="border-l-2 pl-6" style={{ borderColor: 'var(--dourado)' }}>
                <h3 className="font-serif text-xl font-normal mb-2">Escutar antes de mostrar.</h3>
                <p className="text-sm text-muted leading-relaxed font-light">
                  Entendemos o que o cliente realmente busca — e só então começamos a apresentar opções. Nenhuma visita desnecessária, nenhum imóvel fora de propósito.
                </p>
              </div>
              <div className="border-l-2 pl-6" style={{ borderColor: 'var(--dourado)' }}>
                <h3 className="font-serif text-xl font-normal mb-2">Tecnologia a serviço da decisão.</h3>
                <p className="text-sm text-muted leading-relaxed font-light">
                  Nossa IA analisa mercado, tendências regionais e perfil do imóvel para dar ao cliente informação real — não discurso de vendas.
                </p>
              </div>
              <div className="border-l-2 pl-6" style={{ borderColor: 'var(--dourado)' }}>
                <h3 className="font-serif text-xl font-normal mb-2">Presente do início ao fim.</h3>
                <p className="text-sm text-muted leading-relaxed font-light">
                  Da primeira conversa ao registro do imóvel, acompanhamos cada etapa com atenção e cuidado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRASIL SECTION */}
      <section
        className="py-24 px-8"
        style={{
          background: 'var(--azul)',
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl font-normal text-white mb-8" style={{ letterSpacing: '-0.01em' }}>
              Atuação em todo o <em className="italic" style={{ color: 'var(--dourado)' }}>Brasil</em>
            </h2>
            <p className="text-sm text-white/60 leading-relaxed mb-4 font-light">
              Atendemos em todo o litoral brasileiro, desde o Sul até o Nordeste. Cada região tem suas características únicas, e nosso time conhece profundamente as oportunidades em cada destino.
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light">
              Santa Catarina, Rio de Janeiro, São Paulo, Bahia, Pernambuco — qualquer que seja seu interesse, temos propriedades e expertise para orientá-lo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { city: "Florianópolis", state: "SC", props: "45+" },
              { city: "Balneário Camboriú", state: "SC", props: "32+" },
              { city: "Búzios", state: "RJ", props: "28+" },
              { city: "Angra dos Reis", state: "RJ", props: "24+" },
            ].map((item) => (
              <div
                key={item.city}
                className="p-6 text-center rounded-lg"
                style={{
                  background: 'rgba(197,160,89,.08)',
                  border: '1px solid rgba(197,160,89,.2)',
                }}
              >
                <div className="font-serif text-lg text-white font-normal mb-1">{item.city}</div>
                <div className="text-xs text-white/60 uppercase tracking-widest mb-3">{item.state}</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--dourado)' }}>
                  {item.props} propriedades
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

          {/* CTA Section */}
      <section className="py-24 px-8" style={{ background: 'var(--areia)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-normal mb-6" style={{ letterSpacing: '-0.01em' }}>
            Sua janela<br />
            <em className="italic" style={{ color: 'var(--muted)' }}>para o mar</em>
          </h2>
          <p className="text-lg text-muted mb-10 leading-relaxed font-light">
            Unimos expertise imobiliária com inteligência artificial para encontrar seu refúgio perfeito.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setLocation("/chat")}
              className="px-10 py-4 text-white font-semibold text-sm uppercase tracking-widest transition-all hover:opacity-90"
              style={{ background: 'var(--dourado)' }}
            >
              Consultor IA
            </button>
            <button
              onClick={() => setLocation("/properties")}
              className="px-10 py-4 text-azul font-semibold text-sm uppercase tracking-widest border-2 bg-transparent transition-all hover:bg-azul/5"
              style={{ borderColor: 'var(--azul)' }}
            >
              Explorar Imóveis
            </button>
          </div>
        </div>
      </section>

      {/* La Mare Logo & CTA Section */}
      <section className="py-24 px-8" style={{ background: 'var(--azul)' }}>
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo SVG - Official La Mare */}
          <div className="mb-8 flex justify-center">
            <svg viewBox="0 0 100 60" className="w-16 h-10" fill="none">
              <path d="M 25 52 L 25 30 C 25 16 36 6 50 6 C 64 6 75 16 75 30 L 75 52" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              <circle cx="50" cy="18" r="3.5" fill="#C5A059"/>
              <path d="M 14 42 Q 32 33 50 42 T 86 42" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
              <path d="M 14 51 Q 32 42 50 51 T 86 51" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.55"/>
            </svg>
          </div>

          {/* Brand Name */}
          <h2 className="font-serif text-5xl font-normal mb-2 text-white" style={{ letterSpacing: '-0.01em' }}>
            La Mare
          </h2>

          {/* Imobiliária Label */}
          <div className="text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: 'var(--dourado)' }}>
            Imobiliária
          </div>

          {/* Tagline */}
          <p className="text-lg italic mb-10 leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Sua janela para o mar.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setLocation("/chat")}
              className="px-8 py-3 text-white font-semibold text-sm uppercase tracking-widest transition-all hover:opacity-90"
              style={{ background: 'var(--dourado)' }}
            >
              Consultor IA +
            </button>
            <a
              href="https://wa.me/5548988284152"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-white font-semibold text-sm uppercase tracking-widest border-2 transition-all hover:bg-white/10"
              style={{ borderColor: 'var(--dourado)' }}
            >
              ✓ WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1.06); }
          to { transform: scale(1.13); }
        }
      `}</style>
    </div>
  );
}
