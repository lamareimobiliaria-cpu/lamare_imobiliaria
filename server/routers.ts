import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { properties, favorites, chatSessions, users } from "../drizzle/schema";
import { eq, and, gte, lte, like, or, desc, asc, sql } from "drizzle-orm";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  properties: router({
    list: publicProcedure
      .input(
        z
          .object({
            city: z.string().optional(),
            type: z.enum(["apartment", "house", "penthouse", "land", "commercial"]).optional(),
            minPrice: z.number().optional(),
            maxPrice: z.number().optional(),
            minArea: z.number().optional(),
            maxArea: z.number().optional(),
            bedrooms: z.number().optional(),
            bathrooms: z.number().optional(),
            features: z.array(z.string()).optional(),
            status: z.enum(["available", "sold", "rented", "reserved"]).optional(),
            featured: z.boolean().optional(),
            sortBy: z.enum(["price_asc", "price_desc", "date_desc", "date_asc", "area_asc", "area_desc"]).optional(),
            limit: z.number().min(1).max(100).optional(),
            offset: z.number().min(0).optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };

        const conditions: any[] = [];
        if (input?.city) conditions.push(eq(properties.city, input.city));
        if (input?.type) conditions.push(eq(properties.type, input.type));
        if (input?.status) conditions.push(eq(properties.status, input.status));
        else conditions.push(eq(properties.status, "available"));
        if (input?.featured !== undefined) conditions.push(eq(properties.featured, input.featured));
        if (input?.minPrice !== undefined) conditions.push(gte(properties.price, String(input.minPrice)));
        if (input?.maxPrice !== undefined) conditions.push(lte(properties.price, String(input.maxPrice)));
        if (input?.minArea !== undefined) conditions.push(gte(properties.area, String(input.minArea)));
        if (input?.maxArea !== undefined) conditions.push(lte(properties.area, String(input.maxArea)));
        if (input?.bedrooms !== undefined) conditions.push(gte(properties.bedrooms, input.bedrooms));
        if (input?.bathrooms !== undefined) conditions.push(gte(properties.bathrooms, input.bathrooms));

        let query = db.select().from(properties);
        if (conditions.length > 0) query = query.where(and(...conditions)) as any;

        const sortBy = input?.sortBy ?? "date_desc";
        if (sortBy === "price_asc") query = query.orderBy(asc(properties.price)) as any;
        else if (sortBy === "price_desc") query = query.orderBy(desc(properties.price)) as any;
        else if (sortBy === "date_asc") query = query.orderBy(asc(properties.createdAt)) as any;
        else if (sortBy === "area_asc") query = query.orderBy(asc(properties.area)) as any;
        else if (sortBy === "area_desc") query = query.orderBy(desc(properties.area)) as any;
        else query = query.orderBy(desc(properties.createdAt)) as any;

        const limit = input?.limit ?? 12;
        const offset = input?.offset ?? 0;
        query = query.limit(limit).offset(offset) as any;

        const items = await query;
        return { items, total: items.length };
      }),

    search: publicProcedure
      .input(
        z.object({
          q: z.string(),
          sortBy: z.enum(["price_asc", "price_desc", "date_desc", "relevance"]).optional(),
          limit: z.number().min(1).max(50).optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const term = `%${input.q}%`;
        const results = await db
          .select()
          .from(properties)
          .where(
            and(
              eq(properties.status, "available"),
              or(
                like(properties.title, term),
                like(properties.description, term),
                like(properties.city, term),
                like(properties.neighborhood, term)
              )
            )
          )
          .orderBy(desc(properties.createdAt))
          .limit(input.limit ?? 20);
        return results;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(properties).where(eq(properties.id, input.id));
        return result[0] || null;
      }),

    analyze: publicProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
        const result = await db.select().from(properties).where(eq(properties.id, input.propertyId));
        const prop = result[0];
        if (!prop) throw new TRPCError({ code: "NOT_FOUND", message: "Propriedade não encontrada" });

        const price = Number(prop.price);
        const area = Number(prop.area);
        const pricePerSqm = price / area;

        // Estimativas baseadas em dados do mercado litorâneo brasileiro
        const baseRoi = prop.city === "Florianópolis" ? 7.2 : prop.city === "Búzios" ? 8.1 : prop.city === "Balneário Camboriú" ? 6.8 : 7.5;
        const appreciation = prop.city === "Balneário Camboriú" ? 12.3 : prop.city === "Florianópolis" ? 9.8 : prop.city === "Búzios" ? 11.2 : 9.0;

        const financingRates = [
          { bank: "Caixa Econômica Federal", rate: 10.99, term: 360, monthlyPayment: Math.round(price * 0.8 * (0.1099 / 12) / (1 - Math.pow(1 + 0.1099 / 12, -360))) },
          { bank: "Banco do Brasil", rate: 11.49, term: 360, monthlyPayment: Math.round(price * 0.8 * (0.1149 / 12) / (1 - Math.pow(1 + 0.1149 / 12, -360))) },
          { bank: "Itaú", rate: 11.99, term: 360, monthlyPayment: Math.round(price * 0.8 * (0.1199 / 12) / (1 - Math.pow(1 + 0.1199 / 12, -360))) },
          { bank: "Bradesco", rate: 12.25, term: 360, monthlyPayment: Math.round(price * 0.8 * (0.1225 / 12) / (1 - Math.pow(1 + 0.1225 / 12, -360))) },
        ];

        const estimatedRent = Math.round(price * 0.005); // ~0.5% ao mês
        const annualRent = estimatedRent * 12;
        const netRoi = ((annualRent * 0.85) / price) * 100; // 85% após despesas

        return {
          roi: parseFloat(netRoi.toFixed(2)),
          grossRoi: parseFloat(baseRoi.toFixed(2)),
          estimatedAppreciation: parseFloat(appreciation.toFixed(2)),
          estimatedMonthlyRent: estimatedRent,
          pricePerSqm: Math.round(pricePerSqm),
          marketComparison: pricePerSqm < 8000 ? "Abaixo do mercado" : pricePerSqm < 15000 ? "Alinhado ao mercado" : "Acima do mercado",
          financingRates,
          projectedValueIn5Years: Math.round(price * Math.pow(1 + appreciation / 100, 5)),
          projectedValueIn10Years: Math.round(price * Math.pow(1 + appreciation / 100, 10)),
        };
      }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(5),
          description: z.string().optional(),
          price: z.number().positive(),
          area: z.number().positive(),
          bedrooms: z.number().min(0).optional(),
          bathrooms: z.number().min(0).optional(),
          parkingSpots: z.number().min(0).optional(),
          type: z.enum(["apartment", "house", "penthouse", "land", "commercial"]),
          city: z.string().min(2),
          state: z.string().min(2),
          neighborhood: z.string().optional(),
          address: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          beachDistance: z.number().optional(),
          features: z.array(z.string()).optional(),
          coverImage: z.string().optional(),
          images: z.array(z.string()).optional(),
          status: z.enum(["available", "sold", "rented", "reserved"]).optional(),
          featured: z.boolean().optional(),
          yearBuilt: z.number().optional(),
          condoFee: z.number().optional(),
          iptu: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const result = await db.insert(properties).values({
          ...input,
          price: String(input.price),
          area: String(input.area),
          condoFee: input.condoFee ? String(input.condoFee) : null,
          iptu: input.iptu ? String(input.iptu) : null,
          features: input.features ?? [],
          images: input.images ?? [],
        });
        return { id: (result as any).insertId };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(5).optional(),
          description: z.string().optional(),
          price: z.number().positive().optional(),
          area: z.number().positive().optional(),
          bedrooms: z.number().min(0).optional(),
          bathrooms: z.number().min(0).optional(),
          parkingSpots: z.number().min(0).optional(),
          type: z.enum(["apartment", "house", "penthouse", "land", "commercial"]).optional(),
          city: z.string().min(2).optional(),
          state: z.string().min(2).optional(),
          neighborhood: z.string().optional(),
          address: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          beachDistance: z.number().optional(),
          features: z.array(z.string()).optional(),
          coverImage: z.string().optional(),
          images: z.array(z.string()).optional(),
          status: z.enum(["available", "sold", "rented", "reserved"]).optional(),
          featured: z.boolean().optional(),
          yearBuilt: z.number().optional(),
          condoFee: z.number().optional(),
          iptu: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, price, area, condoFee, iptu, ...rest } = input;
        const updateData: any = { ...rest };
        if (price !== undefined) updateData.price = String(price);
        if (area !== undefined) updateData.area = String(area);
        if (condoFee !== undefined) updateData.condoFee = String(condoFee);
        if (iptu !== undefined) updateData.iptu = String(iptu);
        await db.update(properties).set(updateData).where(eq(properties.id, id));
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.delete(properties).where(eq(properties.id, input.id));
        return { success: true };
      }),

    getCities: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.selectDistinct({ city: properties.city }).from(properties).orderBy(asc(properties.city));
      return result.map((r) => r.city);
    }),
  }),

  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      const favs = await db.select().from(favorites).where(eq(favorites.userId, ctx.user.id));
      if (favs.length === 0) return [];
      const ids = favs.map((f) => f.propertyId);
      const props = await db.select().from(properties).where(
        or(...ids.map((id) => eq(properties.id, id)))
      );
      return props;
    }),

    add: protectedProcedure
      .input(z.object({ propertyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const existing = await db
          .select()
          .from(favorites)
          .where(and(eq(favorites.userId, ctx.user.id), eq(favorites.propertyId, input.propertyId)));
        if (existing.length > 0) return { success: true };
        await db.insert(favorites).values({ userId: ctx.user.id, propertyId: input.propertyId });
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ propertyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.delete(favorites).where(and(eq(favorites.userId, ctx.user.id), eq(favorites.propertyId, input.propertyId)));
        return { success: true };
      }),

    isFavorite: protectedProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return false;
        const result = await db
          .select()
          .from(favorites)
          .where(and(eq(favorites.userId, ctx.user.id), eq(favorites.propertyId, input.propertyId)));
        return result.length > 0;
      }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          sessionId: z.number().optional(),
          userId: z.number().optional(),
          clientName: z.string().optional(),
          clientEmail: z.string().optional(),
          clientPhone: z.string().optional(),
          message: z.string().min(1),
          propertyContext: z.object({
            id: z.number(),
            title: z.string(),
            city: z.string(),
            price: z.number(),
          }).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false, response: "Serviço temporariamente indisponível.", sessionId: 0 };

        let sessionId = input.sessionId ?? 0;
        let currentSession: any = null;

        if (sessionId > 0) {
          const existing = await db.select().from(chatSessions).where(eq(chatSessions.id, sessionId));
          if (existing.length > 0) currentSession = existing[0];
        }

        if (!currentSession) {
          const insertResult = await db.insert(chatSessions).values({
            userId: input.userId ?? null,
            clientName: input.clientName ?? null,
            clientEmail: input.clientEmail ?? null,
            clientPhone: input.clientPhone ?? null,
            messages: [],
            status: "active",
          });
          const newId = (insertResult as any).insertId;
          if (!newId) return { success: false, response: "Erro ao criar sessão.", sessionId: 0 };
          const newSession = await db.select().from(chatSessions).where(eq(chatSessions.id, newId));
          currentSession = newSession[0];
          sessionId = currentSession.id;
        }

        const history = (currentSession.messages || []).slice(-10);
        const updatedMessages = [...(currentSession.messages || []), {
          role: "user" as const,
          content: input.message,
          timestamp: new Date().toISOString(),
        }];

        let aiResponse = "Obrigado pela sua mensagem! Estou processando sua solicitação...";
        try {
          const propertyCtx = input.propertyContext
            ? `\n\nContexto da propriedade em análise: ${input.propertyContext.title} em ${input.propertyContext.city}, R$ ${input.propertyContext.price.toLocaleString("pt-BR")}.`
            : "";

          const llmMessages: any[] = [
            {
              role: "system",
              content: `Você é La Mare_IA, uma consultora imobiliária especializada em propriedades litorâneas premium do Brasil. 
Você trabalha para a La Mare Imóveis, plataforma focada em imóveis de alto padrão à beira-mar.
Seja sempre amigável, profissional e empática. Use linguagem sofisticada mas acessível.
Ajude clientes a encontrar o imóvel perfeito, respondendo sobre:
- Características de propriedades específicas
- Análise de investimento (ROI, valorização, financiamento)
- Comparação entre cidades litorâneas (Florianópolis, Búzios, Balneário Camboriú, Angra dos Reis, etc.)
- Processo de compra e documentação
- Tendências do mercado imobiliário litorâneo
Quando relevante, pergunte sobre o orçamento, preferências de localização e objetivos do cliente.${propertyCtx}`,
            },
            ...history.map((m: any) => ({ role: m.role, content: m.content })),
            { role: "user", content: input.message },
          ];

          const llmResponse = await invokeLLM({ messages: llmMessages });
          const content = llmResponse.choices[0]?.message?.content;
          if (typeof content === "string") aiResponse = content;
        } catch (error) {
          console.error("Erro LLM:", error);
        }

        const finalMessages = [...updatedMessages, {
          role: "assistant" as const,
          content: aiResponse,
          timestamp: new Date().toISOString(),
        }];

        await db.update(chatSessions).set({ messages: finalMessages, updatedAt: new Date() }).where(eq(chatSessions.id, sessionId));

        return { success: true, response: aiResponse, sessionId };
      }),

    getHistory: publicProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(chatSessions).where(eq(chatSessions.id, input.sessionId));
        return result[0] || null;
      }),

    getUserSessions: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select()
        .from(chatSessions)
        .where(eq(chatSessions.userId, ctx.user.id))
        .orderBy(desc(chatSessions.updatedAt))
        .limit(10);
    }),
  }),

  admin: router({
    stats: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { totalProperties: 0, availableProperties: 0, totalUsers: 0, totalSessions: 0 };
      const [propsResult, usersResult, sessionsResult] = await Promise.all([
        db.select().from(properties),
        db.select().from(users),
        db.select().from(chatSessions),
      ]);
      return {
        totalProperties: propsResult.length,
        availableProperties: propsResult.filter((p) => p.status === "available").length,
        totalUsers: usersResult.length,
        totalSessions: sessionsResult.length,
      };
    }),

    listAllProperties: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(properties).orderBy(desc(properties.createdAt));
    }),
  }),
});

export type AppRouter = typeof appRouter;
