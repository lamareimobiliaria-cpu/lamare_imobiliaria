# La Mare — TODO

## Backend / Base de Dados
- [x] Schema: tabela `properties` (imóveis litorâneos)
- [x] Schema: tabela `propertyImages` (galeria de imagens)
- [x] Schema: tabela `favorites` (favoritos por utilizador)
- [x] Schema: tabela `chatSessions` (sessões de chat IA)
- [x] Migração SQL aplicada via webdev_execute_sql
- [x] Router: `properties.list` com filtros (cidade, preço, tipo, características)
- [x] Router: `properties.getById` com detalhes completos
- [x] Router: `properties.analyze` (ROI, valorização, financiamento)
- [x] Router: `properties.search` pesquisa avançada com ordenação
- [x] Router: `properties.create/update/delete` (admin)
- [x] Router: `favorites.add/remove/list`
- [x] Router: `chat.sendMessage` com IA La Mare_IA
- [x] Router: `chat.getHistory`
- [x] Seed de dados de exemplo (12 imóveis litorâneos)

## Frontend — Layout Global
- [x] Design system: paleta de cores oceânica (azul-marinho, areia, branco)
- [x] Tipografia: fonte premium (Playfair Display + Inter)
- [x] Navbar com logo La Mare, navegação e autenticação
- [x] Footer com informações e links
- [x] Tema claro com identidade visual premium

## Frontend — Páginas
- [x] Homepage: hero section, destaque de propriedades, CTA
- [x] Página de listagem com filtros laterais e grid de propriedades
- [x] Página de detalhes: galeria, descrição, mapa, análise financeira
- [x] Página de pesquisa avançada
- [x] Página de favoritos do utilizador
- [x] Painel administrativo (gestão de propriedades)
- [x] Página de chat com La Mare_IA

## Funcionalidades
- [x] Filtros por cidade, preço, tipo, características
- [x] Galeria de imagens com lightbox
- [x] Mapa de localização (Google Maps)
- [x] Análise financeira: ROI, valorização, simulação de financiamento
- [x] Chat IA com histórico persistente
- [x] Sistema de favoritos (autenticado)
- [x] Painel admin: CRUD de propriedades
- [x] Pesquisa avançada com ordenação

## Testes & Qualidade
- [x] Testes Vitest para routers principais (9 testes passados)
- [x] Checkpoint final


## Melhorias — Inteligência de Mercado & Galeria Inteligente
- [x] Sessão de inteligência de mercado com análise em tempo real
- [x] Dashboard de tendências de mercado (cidades, preços, tipos)
- [x] Galeria inteligente com dados integrados do imóvel
- [x] Análise financeira em tempo real na galeria
- [x] Indicadores de mercado (valorização, demanda, preço médio)
- [x] Comparação de preços por cidade e tipo
- [ ] Integração do domínio www.lamareimobiliaria.com.br (via Management UI)
- [ ] Otimização SEO e meta tags

## Filtros de Mercado
- [x] Adicionar filtro por tipo de propriedade (apartamento, casa, terreno, etc.)
- [x] Atualizar análises em tempo real ao mudar filtro
- [x] Testes para filtro de tipo de propriedade

## Branding Oficial La Mare
- [x] Importar logo oficial SVG
- [x] Atualizar design system com cores oficiais (Azul #0A2540, Dourado #C5A059, Areia #F9F7F2)
- [x] Atualizar tipografia com Playfair Display + Montserrat
- [x] Adequar Navbar com logo e cores
- [x] Adequar Footer com branding
- [x] Atualizar Homepage com cores e estilo oficial
- [x] Manter dados de contato (CRECI, CNPJ, telefone, email)

## Galeria de Fotos Avançada
- [x] Criar componente PropertyGallery com lightbox
- [x] Implementar navegação por setas (anterior/próxima)
- [x] Adicionar thumbnails para seleção rápida
- [x] Suporte a navegação por teclado (arrow keys, ESC)
- [x] Visualização em tela cheia responsiva
- [x] Integrar galeria na página PropertyDetail
- [x] Adicionar fotos aos imóveis de exemplo
- [x] Testes da galeria


## Manual de Identidade Visual - Conformidade
- [x] Atualizar design system com cores oficiais do manual
- [x] Implementar tipografia Playfair Display + Montserrat conforme manual
- [x] Implementar slogan sem itálico ("Sua janela para o mar")
- [x] Adicionar marca d'água em imagens de propriedades (40-60% opacidade)
- [x] Atualizar canais de contato: (48) 98828-4152, lamareimobiliaria@gmail.com
- [x] Atualizar redes sociais: @lamare_imobiliaria, facebook.com/lamareimobiliaria
- [x] Implementar iconografia oficial (Surf, Mar, Sol, Natureza)
- [x] Validar todas as cores contra códigos hexadecimais do manual


## Correções de Layout e UX
- [x] Corrigir logo na seção "Atuação" (restaurado para logo oficial SVG)
- [x] Melhorar legibilidade de cores na seção "Imobiliária" (atualizado tagline)
- [x] Corrigir navegação da galeria de fotos (rota corrigida de /property/:id para /properties/:id)
- [x] Confirmar dados de contato: (48) 98828-4152, lamareimobiliaria@gmail.com
- [x] Atualizar login para usar lamareimobiliaria@gmail.com
- [x] Atualizar WhatsApp link com número correto (48) 98828-4152


## Correções Finais - v13
- [x] Corrigir erro 404 na navegação de detalhes (rota /properties/:id funcionando)
- [x] Melhorar legibilidade de texto no fundo areia (texto em azul escuro)
- [x] Atualizar endereço para Trindade | Florianópolis
- [x] Remover LinkedIn do footer
- [x] Login gerenciado via Manus OAuth
- [ ] Implementar modal de análise La Mare_IA com abas (próxima fase)


## Modal de Análise de Investimento
- [ ] Criar componente AnalysisModal com 3 abas (Visão Geral, Financiamento, Mercado)
- [ ] Aba Visão Geral: KPIs (Preço/m², Área, Quartos, Valorização, ROI, CUB, SELIC, Rentabilidade, Índice CUB)
- [ ] Aba Financiamento: Simulação de taxas bancárias e parcelamento
- [ ] Aba Mercado: Análise de tendências e comparação de preços
- [ ] Integrar modal na página PropertyDetail
- [ ] Integrar modal na listagem Properties
- [ ] Botão "Falar com Especialista La Mare no WhatsApp" no modal
- [ ] Análise textual com insights de investimento
