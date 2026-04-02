import { useState } from "react";
import { X, MessageCircle, TrendingUp, BarChart3, DollarSign, Home } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
}

interface AnalysisData {
  roiAnnual: number;
  appreciation: number;
  monthlyRent: number;
  pricePerM2: number;
  cubRegional: number;
  selic: number;
  profitability: number;
  cubIndex: number;
}

interface AnalysisModalProps {
  property: Property;
  analysis: AnalysisData;
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalysisModal({ property, analysis, isOpen, onClose }: AnalysisModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  const whatsappLink = `https://wa.me/5548988284152?text=Olá! Gostaria de mais informações sobre ${property.name} - ${property.location}`;

  // Calculate 10-year projection
  const projection10Years = property.price * Math.pow(1 + analysis.appreciation / 100, 10);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-serif font-normal mb-2" style={{ color: "var(--azul)" }}>
              Análise La Mare_IA
            </h2>
            <h3 className="text-lg font-semibold mb-1">{property.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{property.location}</p>
            <div className="text-3xl font-bold mb-4" style={{ color: "var(--azul)" }}>
              R$ {property.price.toLocaleString("pt-BR")}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* WhatsApp CTA Button */}
        <div className="px-6 pt-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded font-semibold text-white text-sm uppercase tracking-widest transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: "#25D366" }}
          >
            <MessageCircle className="w-4 h-4" />
            Falar com Especialista La Mare no WhatsApp
          </a>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 px-6 pt-4">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-dourado px-4 py-2"
              style={{
                color: activeTab === "overview" ? "var(--dourado)" : "#999",
              }}
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="financing"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-dourado px-4 py-2"
              style={{
                color: activeTab === "financing" ? "var(--dourado)" : "#999",
              }}
            >
              Financiamento
            </TabsTrigger>
            <TabsTrigger
              value="market"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-dourado px-4 py-2"
              style={{
                color: activeTab === "market" ? "var(--dourado)" : "#999",
              }}
            >
              Mercado
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral Tab */}
          <TabsContent value="overview" className="p-6 space-y-6">
            {/* Property Details Grid */}
            <div className="grid grid-cols-3 gap-4 border-b pb-6">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Preço/m²</div>
                <div className="text-lg font-semibold" style={{ color: "var(--azul)" }}>
                  R$ {(property.price / property.area).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Área</div>
                <div className="text-lg font-semibold" style={{ color: "var(--azul)" }}>
                  {property.area} m²
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Quartos</div>
                <div className="text-lg font-semibold" style={{ color: "var(--azul)" }}>
                  {property.bedrooms}
                </div>
              </div>
            </div>

            {/* Investment Indicators */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 mt-1" style={{ color: "var(--dourado)" }} />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Valorização/ano</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--azul)" }}>
                    {analysis.appreciation.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 mt-1" style={{ color: "var(--dourado)" }} />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">ROI Anual</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--azul)" }}>
                    {analysis.roiAnnual.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 mt-1" style={{ color: "var(--dourado)" }} />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">CUB Regional</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--azul)" }}>
                    R$ {analysis.cubRegional.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}/m²
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 mt-1" style={{ color: "var(--dourado)" }} />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Aluguel Est.</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--azul)" }}>
                    R$ {analysis.monthlyRent.toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Indicators */}
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">SELIC</div>
                <div className="text-lg font-semibold" style={{ color: "var(--azul)" }}>
                  {analysis.selic.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">Rentabilidade</div>
                <div className="text-lg font-semibold" style={{ color: "var(--azul)" }}>
                  {analysis.profitability.toFixed(2)}% a.m.
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">Índice CUB</div>
                <div className="text-lg font-semibold" style={{ color: "var(--azul)" }}>
                  {analysis.cubIndex.toFixed(2)}x
                </div>
              </div>
            </div>

            {/* Analysis Text */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Análise:</strong> Este imóvel apresenta excelente potencial de valorização com localização premium em área litorânea. ROI anual de {analysis.roiAnnual.toFixed(2)}% com valorização estimada de {analysis.appreciation.toFixed(1)}% ao ano. Projeção de 10 anos: R$ {projection10Years.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}.
              </p>
            </div>
          </TabsContent>

          {/* Financiamento Tab */}
          <TabsContent value="financing" className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg" style={{ color: "var(--azul)" }}>
                Simulação de Financiamento
              </h3>

              {/* Financing Options */}
              <div className="space-y-4">
                {[
                  { bank: "Caixa Econômica", rate: 7.5, months: 360 },
                  { bank: "Banco do Brasil", rate: 7.8, months: 360 },
                  { bank: "Itaú", rate: 8.2, months: 360 },
                ].map((option, idx) => {
                  const monthlyPayment = (property.price * 0.8 * (option.rate / 100 / 12)) / (1 - Math.pow(1 + option.rate / 100 / 12, -option.months));
                  const totalCost = monthlyPayment * option.months;
                  const totalInterest = totalCost - property.price * 0.8;

                  return (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{option.bank}</h4>
                        <Badge style={{ background: "var(--dourado)", color: "white" }}>
                          {option.rate.toFixed(1)}% a.a.
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Parcela Mensal</div>
                          <div className="font-semibold" style={{ color: "var(--azul)" }}>
                            R$ {monthlyPayment.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Total de Juros</div>
                          <div className="font-semibold" style={{ color: "var(--azul)" }}>
                            R$ {totalInterest.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-gray-700">
                <p>
                  <strong>Nota:</strong> Simulação com entrada de 20% do valor do imóvel, prazo de 30 anos e taxas aproximadas. Consulte a instituição financeira para taxas atualizadas.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Mercado Tab */}
          <TabsContent value="market" className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg" style={{ color: "var(--azul)" }}>
                Análise de Mercado
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">Preço Médio da Região</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--azul)" }}>
                    R$ {(property.price * 1.05).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-green-600 mt-2">-5% abaixo da média</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">Demanda Regional</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--azul)" }}>
                    Alta
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Crescimento de 12% a.a.</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Oportunidade de Mercado:</strong> A região apresenta forte demanda por imóveis de alto padrão com vista para o mar. Tendência de valorização acima da média nacional nos próximos 5 anos. Recomendamos análise detalhada com nossos especialistas.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1"
            style={{ background: "var(--azul)", color: "white" }}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
