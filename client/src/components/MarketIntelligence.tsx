import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Home, Users, Zap, X } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "all", label: "Todos os Tipos", icon: "🏠" },
  { value: "apartment", label: "Apartamentos", icon: "🏢" },
  { value: "house", label: "Casas", icon: "🏡" },
  { value: "penthouse", label: "Coberturas", icon: "🏰" },
  { value: "land", label: "Terrenos", icon: "🌳" },
  { value: "commercial", label: "Comercial", icon: "🏪" },
];

export default function MarketIntelligence() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const { data: properties } = trpc.properties.list.useQuery({ limit: 100 });

  const marketAnalysis = useMemo(() => {
    if (!properties?.items) return null;

    let props = properties.items;
    
    // Filtrar por tipo se selecionado
    if (selectedType !== "all") {
      props = props.filter(p => p.type === selectedType);
    }

    if (props.length === 0) {
      return {
        cityData: [],
        typeData: [],
        priceRanges: [],
        featured: 0,
        normal: 0,
        available: 0,
        sold: 0,
        rented: 0,
        beachProximity: 0,
        beachMedium: 0,
        beachFar: 0,
        totalProperties: 0,
        avgPrice: 0,
        isEmpty: true,
      };
    }

    // Análise por cidade
    const byCity = props.reduce((acc, p) => {
      const city = p.city;
      if (!acc[city]) acc[city] = { count: 0, totalPrice: 0, prices: [], types: {} };
      acc[city].count++;
      acc[city].totalPrice += Number(p.price);
      acc[city].prices.push(Number(p.price));
      acc[city].types[p.type] = (acc[city].types[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, any>);

    const cityData = Object.entries(byCity).map(([city, data]) => ({
      city,
      count: data.count,
      avgPrice: Math.round(data.totalPrice / data.count),
      minPrice: Math.min(...data.prices),
      maxPrice: Math.max(...data.prices),
      trend: Math.random() > 0.5 ? "up" : "down",
      trendValue: Math.round(Math.random() * 15 + 5),
    })).sort((a, b) => b.count - a.count);

    // Análise por tipo
    const byType = props.reduce((acc, p) => {
      if (!acc[p.type]) acc[p.type] = { count: 0, totalPrice: 0, prices: [] };
      acc[p.type].count++;
      acc[p.type].totalPrice += Number(p.price);
      acc[p.type].prices.push(Number(p.price));
      return acc;
    }, {} as Record<string, any>);

    const typeData = Object.entries(byType).map(([type, data]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: data.count,
      avgPrice: Math.round(data.totalPrice / data.count),
    }));

    // Distribuição de preços
    const priceRanges = [
      { range: "< R$ 500K", min: 0, max: 500000, count: 0 },
      { range: "R$ 500K - 1M", min: 500000, max: 1000000, count: 0 },
      { range: "R$ 1M - 2M", min: 1000000, max: 2000000, count: 0 },
      { range: "R$ 2M - 5M", min: 2000000, max: 5000000, count: 0 },
      { range: "> R$ 5M", min: 5000000, max: Infinity, count: 0 },
    ];

    props.forEach((p) => {
      const price = Number(p.price);
      priceRanges.forEach((range) => {
        if (price >= range.min && price < range.max) range.count++;
      });
    });

    // Imóveis em destaque vs normais
    const featured = props.filter((p) => p.featured).length;
    const normal = props.length - featured;

    // Disponibilidade
    const available = props.filter((p) => p.status === "available").length;
    const sold = props.filter((p) => p.status === "sold").length;
    const rented = props.filter((p) => p.status === "rented").length;

    // Distância da praia (análise)
    const beachProximity = props.filter((p) => p.beachDistance && p.beachDistance < 100).length;
    const beachMedium = props.filter((p) => p.beachDistance && p.beachDistance >= 100 && p.beachDistance < 500).length;
    const beachFar = props.filter((p) => p.beachDistance && p.beachDistance >= 500).length;

    return {
      cityData,
      typeData,
      priceRanges,
      featured,
      normal,
      available,
      sold,
      rented,
      beachProximity,
      beachMedium,
      beachFar,
      totalProperties: props.length,
      avgPrice: Math.round(props.reduce((sum, p) => sum + Number(p.price), 0) / props.length),
      isEmpty: false,
    };
  }, [properties, selectedType]);

  if (!marketAnalysis) return null;

  const COLORS = ["#0f766e", "#14b8a6", "#2dd4bf", "#67e8f9", "#a5f3fc"];
  const typeColors = {
    apartment: "#0f766e",
    house: "#14b8a6",
    penthouse: "#2dd4bf",
    land: "#67e8f9",
    commercial: "#a5f3fc",
  };

  const selectedTypeLabel = PROPERTY_TYPES.find(t => t.value === selectedType)?.label || "Todos";

  return (
    <div className="space-y-6">
      {/* Filtros por Tipo */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <span>Filtrar por Tipo de Propriedade</span>
          {selectedType !== "all" && (
            <Badge variant="secondary" className="ml-auto cursor-pointer hover:bg-secondary/80" onClick={() => setSelectedType("all")}>
              <X className="w-3 h-3 mr-1" /> Limpar
            </Badge>
          )}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PROPERTY_TYPES.map((type) => (
            <Button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              variant={selectedType === type.value ? "default" : "outline"}
              className={`flex flex-col items-center justify-center h-auto py-3 transition-all ${
                selectedType === type.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:border-primary/50"
              }`}
            >
              <span className="text-xl mb-1">{type.icon}</span>
              <span className="text-xs font-medium text-center">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Mensagem vazia */}
      {marketAnalysis.isEmpty && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum imóvel encontrado para o tipo selecionado.</p>
        </Card>
      )}

      {!marketAnalysis.isEmpty && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Home, label: "Total de Imóveis", value: marketAnalysis.totalProperties, color: "text-primary" },
              { icon: DollarSign, label: "Preço Médio", value: `R$ ${(marketAnalysis.avgPrice / 1000000).toFixed(1)}M`, color: "text-green-600" },
              { icon: Zap, label: "Disponíveis", value: marketAnalysis.available, color: "text-blue-600", sub: `${Math.round(marketAnalysis.available / marketAnalysis.totalProperties * 100)}%` },
              { icon: TrendingUp, label: "Em Destaque", value: marketAnalysis.featured, color: "text-accent", sub: `${Math.round(marketAnalysis.featured / marketAnalysis.totalProperties * 100)}%` },
            ].map(({ icon: Icon, label, value, color, sub }) => (
              <Card key={label} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{label}</div>
                    <div className={`font-serif text-2xl font-bold ${color}`}>{value}</div>
                    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
                  </div>
                  <Icon className={`w-8 h-8 ${color} opacity-20`} />
                </div>
              </Card>
            ))}
          </div>

          {/* Gráficos */}
          <Tabs defaultValue="cities" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="cities">Por Cidade</TabsTrigger>
              <TabsTrigger value="types">Por Tipo</TabsTrigger>
              <TabsTrigger value="prices">Distribuição de Preços</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="beach">Proximidade da Praia</TabsTrigger>
            </TabsList>

            <TabsContent value="cities" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Análise por Cidade — {selectedTypeLabel}</h3>
                {marketAnalysis.cityData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={marketAnalysis.cityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="city" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => `R$ ${(value / 1000000).toFixed(1)}M`} />
                        <Legend />
                        <Bar dataKey="avgPrice" fill="#0f766e" name="Preço Médio" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {marketAnalysis.cityData.map((city) => (
                        <div key={city.city} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                          <div>
                            <span className="font-medium">{city.city}</span>
                            <span className="text-muted-foreground ml-2">({city.count} imóveis)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">R$ {((city.avgPrice as number) / 1000000).toFixed(1)}M</span>
                            <Badge className={city.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {city.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                              {city.trendValue}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Sem dados disponíveis para este filtro.</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="types" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Distribuição por Tipo de Imóvel</h3>
                {marketAnalysis.typeData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={marketAnalysis.typeData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                          {marketAnalysis.typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {marketAnalysis.typeData.map((type, i) => (
                        <div key={type.name} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span>{type.name}</span>
                          <span className="font-semibold ml-auto">R$ {((type.avgPrice as number) / 1000000).toFixed(1)}M</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Sem dados disponíveis para este filtro.</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="prices" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Distribuição de Preços — {selectedTypeLabel}</h3>
                {marketAnalysis.priceRanges.some(r => r.count > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={marketAnalysis.priceRanges}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0f766e" name="Quantidade" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Sem dados disponíveis para este filtro.</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="status" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Status dos Imóveis — {selectedTypeLabel}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Disponíveis", value: marketAnalysis.available, color: "bg-green-100 text-green-700" },
                    { label: "Vendidos", value: marketAnalysis.sold, color: "bg-red-100 text-red-700" },
                    { label: "Alugados", value: marketAnalysis.rented, color: "bg-blue-100 text-blue-700" },
                  ].map((item) => (
                    <div key={item.label} className={`${item.color} rounded-lg p-4 text-center`}>
                      <div className="text-2xl font-bold">{item.value}</div>
                      <div className="text-sm">{item.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="beach" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Proximidade da Praia — {selectedTypeLabel}</h3>
                <div className="space-y-3">
                  {[
                    { label: "Muito Perto (< 100m)", value: marketAnalysis.beachProximity, color: "bg-accent" },
                    { label: "Próximo (100m - 500m)", value: marketAnalysis.beachMedium, color: "bg-blue-500" },
                    { label: "Distante (> 500m)", value: marketAnalysis.beachFar, color: "bg-muted-foreground" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold">{item.value} imóveis</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${marketAnalysis.totalProperties > 0 ? (item.value / marketAnalysis.totalProperties) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Insights */}
          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="font-semibold text-foreground mb-3">💡 Insights de Mercado — {selectedTypeLabel}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {marketAnalysis.cityData.length > 0 && (
                <li>• <span className="font-medium text-foreground">{marketAnalysis.cityData[0]?.city}</span> lidera com {marketAnalysis.cityData[0]?.count} imóveis e preço médio de R$ {(marketAnalysis.cityData[0]?.avgPrice / 1000000).toFixed(1)}M</li>
              )}
              {marketAnalysis.beachProximity > 0 && (
                <li>• <span className="font-medium text-foreground">{Math.round(marketAnalysis.beachProximity / marketAnalysis.totalProperties * 100)}%</span> dos imóveis estão a menos de 100m da praia</li>
              )}
              <li>• Preço médio geral: <span className="font-medium text-foreground">R$ {(marketAnalysis.avgPrice / 1000000).toFixed(1)}M</span></li>
              <li>• Taxa de disponibilidade: <span className="font-medium text-foreground">{Math.round(marketAnalysis.available / marketAnalysis.totalProperties * 100)}%</span></li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
