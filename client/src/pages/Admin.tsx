import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  LayoutDashboard, Plus, Edit, Trash2, Building2, Users, MessageCircle,
  TrendingUp, LogIn, Shield, Search, X
} from "lucide-react";

const TYPE_OPTIONS = [
  { value: "apartment", label: "Apartamento" },
  { value: "house", label: "Casa" },
  { value: "penthouse", label: "Cobertura" },
  { value: "land", label: "Terreno" },
  { value: "commercial", label: "Comercial" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Disponível" },
  { value: "sold", label: "Vendido" },
  { value: "rented", label: "Alugado" },
  { value: "reserved", label: "Reservado" },
];

const FEATURES_LIST = [
  "Piscina", "Academia", "Churrasqueira", "Varanda", "Vista para o mar",
  "Área gourmet", "Portaria 24h", "Elevador", "Jardim", "Sauna", "Spa",
  "Quadra esportiva", "Playground", "Salão de festas", "Coworking",
];

type PropertyForm = {
  title: string; description: string; price: string; area: string;
  bedrooms: string; bathrooms: string; parkingSpots: string;
  type: string; city: string; state: string; neighborhood: string;
  address: string; latitude: string; longitude: string; beachDistance: string;
  features: string[]; coverImage: string; images: string;
  status: string; featured: boolean; yearBuilt: string; condoFee: string; iptu: string;
};

const emptyForm: PropertyForm = {
  title: "", description: "", price: "", area: "", bedrooms: "", bathrooms: "",
  parkingSpots: "", type: "apartment", city: "", state: "", neighborhood: "",
  address: "", latitude: "", longitude: "", beachDistance: "", features: [],
  coverImage: "", images: "", status: "available", featured: false, yearBuilt: "", condoFee: "", iptu: "",
};

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PropertyForm>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: stats } = trpc.admin.stats.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: properties, isLoading } = trpc.admin.listAllProperties.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });

  const createMutation = trpc.properties.create.useMutation({
    onSuccess: () => { toast.success("Imóvel criado com sucesso!"); setShowForm(false); setForm(emptyForm); utils.admin.listAllProperties.invalidate(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.properties.update.useMutation({
    onSuccess: () => { toast.success("Imóvel atualizado!"); setShowForm(false); setEditId(null); setForm(emptyForm); utils.admin.listAllProperties.invalidate(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.properties.delete.useMutation({
    onSuccess: () => { toast.success("Imóvel removido."); setDeleteConfirm(null); utils.admin.listAllProperties.invalidate(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  if (loading) return <div className="min-h-screen bg-background"><Navbar /><div className="pt-16 container py-12"><Skeleton className="h-96 w-full rounded-2xl" /></div></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-3">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-6">Faça login para acessar o painel administrativo.</p>
            <Button onClick={() => window.location.href = getLoginUrl()} className="gap-2"><LogIn className="w-4 h-4" /> Entrar</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-3">Sem permissão</h2>
            <p className="text-muted-foreground mb-6">Esta área é restrita a administradores.</p>
            <Button onClick={() => setLocation("/")} variant="outline">Voltar ao início</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEdit = (property: any) => {
    setEditId(property.id);
    setForm({
      title: property.title ?? "", description: property.description ?? "",
      price: String(property.price ?? ""), area: String(property.area ?? ""),
      bedrooms: String(property.bedrooms ?? ""), bathrooms: String(property.bathrooms ?? ""),
      parkingSpots: String(property.parkingSpots ?? ""), type: property.type ?? "apartment",
      city: property.city ?? "", state: property.state ?? "", neighborhood: property.neighborhood ?? "",
      address: property.address ?? "", latitude: String(property.latitude ?? ""),
      longitude: String(property.longitude ?? ""), beachDistance: String(property.beachDistance ?? ""),
      features: (property.features as string[]) ?? [], coverImage: property.coverImage ?? "",
      images: ((property.images as string[]) ?? []).join("\n"),
      status: property.status ?? "available", featured: property.featured ?? false,
      yearBuilt: String(property.yearBuilt ?? ""), condoFee: String(property.condoFee ?? ""), iptu: String(property.iptu ?? ""),
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    const payload = {
      title: form.title, description: form.description || undefined,
      price: parseFloat(form.price), area: parseFloat(form.area),
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
      parkingSpots: form.parkingSpots ? parseInt(form.parkingSpots) : undefined,
      type: form.type as any, city: form.city, state: form.state,
      neighborhood: form.neighborhood || undefined, address: form.address || undefined,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      beachDistance: form.beachDistance ? parseInt(form.beachDistance) : undefined,
      features: form.features, coverImage: form.coverImage || undefined,
      images: form.images ? form.images.split("\n").filter(Boolean) : undefined,
      status: form.status as any, featured: form.featured,
      yearBuilt: form.yearBuilt ? parseInt(form.yearBuilt) : undefined,
      condoFee: form.condoFee ? parseFloat(form.condoFee) : undefined,
      iptu: form.iptu ? parseFloat(form.iptu) : undefined,
    };
    if (editId) updateMutation.mutate({ id: editId, ...payload });
    else createMutation.mutate(payload);
  };

  const filtered = properties?.filter((p) =>
    !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFeature = (f: string) => {
    setForm((prev) => ({ ...prev, features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="bg-ocean-deep text-white py-10">
          <div className="container">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <LayoutDashboard className="w-4 h-4" /> Administração
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Painel Administrativo</h1>
          </div>
        </div>

        <div className="container py-8">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Building2, label: "Total de Imóveis", value: stats.totalProperties, color: "text-primary" },
                { icon: TrendingUp, label: "Disponíveis", value: stats.availableProperties, color: "text-green-600" },
                { icon: Users, label: "Utilizadores", value: stats.totalUsers, color: "text-blue-600" },
                { icon: MessageCircle, label: "Sessões de Chat", value: stats.totalSessions, color: "text-accent" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5">
                  <Icon className={`w-6 h-6 ${color} mb-2`} />
                  <div className={`font-serif text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Properties management */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="font-serif text-xl font-bold">Gestão de Imóveis</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar..." className="pl-9 w-48" />
                </div>
                <Button onClick={() => { setEditId(null); setForm(emptyForm); setShowForm(true); }} className="gap-2">
                  <Plus className="w-4 h-4" /> Novo Imóvel
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-semibold text-muted-foreground">Título</th>
                      <th className="pb-3 font-semibold text-muted-foreground">Cidade</th>
                      <th className="pb-3 font-semibold text-muted-foreground">Tipo</th>
                      <th className="pb-3 font-semibold text-muted-foreground">Preço</th>
                      <th className="pb-3 font-semibold text-muted-foreground">Status</th>
                      <th className="pb-3 font-semibold text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered?.map((property) => (
                      <tr key={property.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{property.title}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{property.city}</td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary" className="text-xs">{TYPE_OPTIONS.find(t => t.value === property.type)?.label}</Badge>
                        </td>
                        <td className="py-3 pr-4 font-medium">R$ {Number(property.price).toLocaleString("pt-BR")}</td>
                        <td className="py-3 pr-4">
                          <Badge className={`text-xs ${property.status === "available" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                            {STATUS_OPTIONS.find(s => s.value === property.status)?.label}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(property)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(property.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered?.length === 0 && (
                      <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">Nenhum imóvel encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditId(null); setForm(emptyForm); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editId ? "Editar Imóvel" : "Novo Imóvel"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="sm:col-span-2">
              <Label>Título *</Label>
              <Input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Apartamento Frente Mar em Florianópolis" />
            </div>
            <div className="sm:col-span-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Descrição detalhada do imóvel..." />
            </div>
            <div>
              <Label>Preço (R$) *</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))} placeholder="1500000" />
            </div>
            <div>
              <Label>Área (m²) *</Label>
              <Input type="number" value={form.area} onChange={(e) => setForm(p => ({ ...p, area: e.target.value }))} placeholder="120" />
            </div>
            <div>
              <Label>Tipo *</Label>
              <Select value={form.type} onValueChange={(v) => setForm(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm(p => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cidade *</Label>
              <Input value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Florianópolis" />
            </div>
            <div>
              <Label>Estado *</Label>
              <Input value={form.state} onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))} placeholder="SC" />
            </div>
            <div>
              <Label>Bairro</Label>
              <Input value={form.neighborhood} onChange={(e) => setForm(p => ({ ...p, neighborhood: e.target.value }))} placeholder="Jurerê Internacional" />
            </div>
            <div>
              <Label>Distância da Praia (m)</Label>
              <Input type="number" value={form.beachDistance} onChange={(e) => setForm(p => ({ ...p, beachDistance: e.target.value }))} placeholder="50" />
            </div>
            <div>
              <Label>Quartos</Label>
              <Input type="number" value={form.bedrooms} onChange={(e) => setForm(p => ({ ...p, bedrooms: e.target.value }))} placeholder="3" />
            </div>
            <div>
              <Label>Banheiros</Label>
              <Input type="number" value={form.bathrooms} onChange={(e) => setForm(p => ({ ...p, bathrooms: e.target.value }))} placeholder="2" />
            </div>
            <div>
              <Label>Vagas</Label>
              <Input type="number" value={form.parkingSpots} onChange={(e) => setForm(p => ({ ...p, parkingSpots: e.target.value }))} placeholder="2" />
            </div>
            <div>
              <Label>Ano de Construção</Label>
              <Input type="number" value={form.yearBuilt} onChange={(e) => setForm(p => ({ ...p, yearBuilt: e.target.value }))} placeholder="2020" />
            </div>
            <div>
              <Label>Condomínio (R$/mês)</Label>
              <Input type="number" value={form.condoFee} onChange={(e) => setForm(p => ({ ...p, condoFee: e.target.value }))} placeholder="1200" />
            </div>
            <div>
              <Label>IPTU (R$/ano)</Label>
              <Input type="number" value={form.iptu} onChange={(e) => setForm(p => ({ ...p, iptu: e.target.value }))} placeholder="3600" />
            </div>
            <div>
              <Label>Latitude</Label>
              <Input type="number" value={form.latitude} onChange={(e) => setForm(p => ({ ...p, latitude: e.target.value }))} placeholder="-27.5954" />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input type="number" value={form.longitude} onChange={(e) => setForm(p => ({ ...p, longitude: e.target.value }))} placeholder="-48.5480" />
            </div>
            <div className="sm:col-span-2">
              <Label>URL da Imagem Principal</Label>
              <Input value={form.coverImage} onChange={(e) => setForm(p => ({ ...p, coverImage: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <Label>URLs de Imagens (uma por linha)</Label>
              <Textarea value={form.images} onChange={(e) => setForm(p => ({ ...p, images: e.target.value }))} rows={3} placeholder="https://imagem1.jpg&#10;https://imagem2.jpg" />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-2 block">Características</Label>
              <div className="flex flex-wrap gap-1.5">
                {FEATURES_LIST.map((f) => (
                  <button key={f} type="button" onClick={() => toggleFeature(f)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${form.features.includes(f) ? "bg-accent text-white border-accent" : "border-border hover:border-accent/50 text-muted-foreground"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm(p => ({ ...p, featured: v }))} />
              <Label>Imóvel em Destaque</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editId ? "Atualizar" : "Criar Imóvel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar remoção</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">Tem a certeza que deseja remover este imóvel? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && deleteMutation.mutate({ id: deleteConfirm })} disabled={deleteMutation.isPending}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
