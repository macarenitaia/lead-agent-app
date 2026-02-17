# 📋 BUSINESS_LOGIC.md - Autonoma AI Agency CRM

> Generado por SaaS Factory | Fecha: 2026-02-17

## 1. Problema de Negocio

**Dolor:** Los leads de una agencia de IA están dispersos entre WhatsApp y la Web. La gestión de facturas, calendarios y reportes de rendimiento de agentes externos es manual, lenta y propensa a errores.
**Costo actual:** Empezando de 0, pero se busca evitar el costo de contratar a 2-3 personas para administración, marketing y ventas mediante automatización total.

## 2. Solución

**Propuesta de valor:** Un CRM inteligente + Agencia de IA "In-House" que actúa como Director de Ventas autónomo. El sistema no solo registra datos, sino que monitoriza proactivamente el estado del Pipeline y ejecuta acciones multicanal (Email + WhatsApp) para mover los leads hacia el cierre.

**Flujo de Autonomía IA:**

1. **Escaneo de Embudo:** El agente revisa periódicamente el estado de todos los leads.
2. **Diagnóstico por Fase:** Identifica qué lead necesita un "empujón" según el tiempo que lleva en una etapa.
3. **Decisión de Acción:** Determina el mejor canal (WA o Email) y el contenido (Plantilla técnica, Recurso de valor, o Propuesta comercial).
4. **Ejecución y Seguimiento:** Envía la comunicación y actualiza el Score del lead según la interacción recibida.

## 3. Usuario Objetivo

**Rol:** Dueño de Agencia de IA (Solopreneur).
**Contexto:** Necesita que el sistema sea su "socio" que propone ideas de conversión y las ejecuta (envío de campañas, ajustes de funnel) sin intervención constante.

## 4. Arquitectura de Datos

**Input:**

- Mensajes de WhatsApp (Webhook).
- Mensajes Chat Web.
- Documentos/Capturas de Transferencia.
- Emails de clientes.
- Disponibilidad de Calendario.

**Output:**

- Leads calificados en Pipeline.
- Mails de Nurturing (Respuesta a dudas + Recursos).
- Enlaces de Google Meet + Citas en calendario.
- Facturas PDF.
- Reportes Mensuales de Performance.

**Storage (Supabase tables sugeridas):**

- `leads`: Datos, score, etapa actual y fecha de última interacción.
- `messages`: Historial omnicanal unificado.
- `pipeline_stages`: Etapas (Nuevo, Contactado, Nutriendo, Propuesta, Cerrado).
- `automations_log`: Registro de qué envió la IA, cuándo y por qué (para auditoría).
- `appointments`: Calendario y links de Meet.
- `invoices`: Registro de pagos y facturas.
- `ai_sales_brain`: Tabla de "Memoria" donde el agente guarda sus estrategias de conversión para cada tipo de cliente.

## 5. KPI de Éxito

**Métrica principal:** 100% de leads respondidos en < 1 minuto y 0 facturas generadas manualmente.

## 6. Especificación Técnica (Para el Agente)

### Features a Implementar (Feature-First)

```
src/features/
├── auth/           # Autenticación Email/Password (Supabase)
├── leads/          # Gestión de Pipeline, Scoring IA y Vista de Funnel
├── chat/           # Consola Omnicanal (WhatsApp + Web Chat)
├── calendar/       # Sistema de citas propio e integración Meet
├── billing/        # Gestión de transferencias y generación de Facturas
└── reporting/      # Dashboard y generación de reportes mensuales
```

### Stack Confirmado

- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4 + shadcn/ui
- **Backend:** Supabase (Auth + Database + Storage)
- **AI Engine:** Vercel AI SDK (para Scoring y Agente de Ventas)
- **Validación:** Zod
- **Testing:** Playwright MCP (Validación de flujos de chat/calendario)

### Próximos Pasos

1. [ ] Setup proyecto base y estilos iniciales (shadcn).
2. [ ] Configurar tablas en Supabase según esquema sugerido.
3. [ ] Implementar Feature: Chat Omnicanal (Captura inicial).
4. [ ] Implementar Feature: Pipeline de Ventas + Scoring IA.
5. [ ] Implementar Feature: Calendario y Facturación.
6. [ ] Testing E2E con Playwright.

```
