# 🤖 Agente IA de Captura de Leads

Un agente conversacional inteligente especializado en captura de leads usando técnicas de PNL (Programación Neurolingüística), con integración a Odoo CRM y sistema RAG (Retrieval-Augmented Generation) powered by Supabase + OpenAI.

## 🎯 Características

- **🧠 IA con PNL**: Técnicas avanzadas de ventas y persuasión
- **💬 Chat Widget Embebible**: Integración fácil en cualquier web
- **📊 Sync con Odoo**: Leads sincronizados automáticamente
- **🔍 RAG Inteligente**: Respuestas contextuales desde base de conocimiento
- **✅ Cualificación Automática**: Scoring de leads en tiempo real
- **📅 Agendamiento Directo**: Propone y confirma reuniones

## 🚀 Stack Tecnológico

- **Frontend/Backend**: Next.js 14 + TypeScript
- **Base de Datos**: Supabase (PostgreSQL + pgvector)
- **IA**: OpenAI GPT-4 + text-embedding-3-small
- **CRM**: Odoo (integración vía XML-RPC)
- **UI**: TailwindCSS + Framer Motion
- **Markdown**: React Markdown para respuestas formateadas

## 📋 Prerequisitos

1. **Node.js 18+** instalado
2. **Cuenta de Supabase** (ya configurada en: `https://rsbgkjkmvogbptpkklbm.supabase.co`)
3. **API Key de OpenAI**
4. **Credenciales de Odoo** (URL, DB, usuario, password)

## ⚙️ Configuración

### 1. Configurar Base de Datos en Supabase

1. Abre el SQL Editor en tu panel de Supabase
2. Ejecuta el archivo `supabase-schema.sql` que está en la raíz del proyecto
3. Esto creará:
   - Tablas: `conversations`, `messages`, `leads`, `knowledge_base`
   - Extensión `pgvector` para búsqueda semántica
   - Funciones y triggers necesarios

### 2. Configurar Variables de Entorno

Edita el archivo `.env.local` y completa las siguientes variables:

```env
# Supabase Configuration (ya configurado)
NEXT_PUBLIC_SUPABASE_URL=https://rsbgkjkmvogbptpkklbm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# OpenAI Configuration
OPENAI_API_KEY=tu_openai_api_key_aqui
OPENAI_MODEL=gpt-4-turbo-preview

# Odoo Configuration
ODOO_URL=https://tu-empresa.odoo.com
ODOO_DB=nombre_de_tu_base_de_datos
ODOO_USERNAME=tu_usuario_odoo
ODOO_PASSWORD=tu_password_o_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Cómo obtener las claves

**Supabase Anon Key:**

1. Ve a tu proyecto en Supabase
2. Settings → API
3. Copia el `anon/public` key

**OpenAI API Key:**

1. Ve a <https://platform.openai.com/api-keys>
2. Crea una nueva API key
3. Cópiala (no podrás verla de nuevo)

**Odoo Credentials:**

1. URL: La dirección de tu instancia Odoo (ej: `https://miempresa.odoo.com`)
2. DB: Nombre de tu base de datos en Odoo
3. Username: Tu email de Odoo
4. Password: Tu contraseña o API key si usas autenticación por token

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📚 Cargar Información a la Base de Conocimiento (RAG)

Para que el agente pueda responder preguntas específicas sobre tus productos/servicios, debes cargar documentos a la base de conocimiento:

### Opción 1: Usando el API Endpoint

```bash
curl -X POST http://localhost:3000/api/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Información de Productos",
    "content": "Ofrecemos soluciones de software empresarial...",
    "metadata": {"category": "productos"}
  }'
```

### Opción 2: Crear un Script de Ingesta

Crea un archivo `scripts/ingest-knowledge.ts`:

```typescript
const documents = [
  {
    title: "Precios y Planes",
    content: `
      Plan Básico: 99€/mes - Hasta 5 usuarios
      Plan Pro: 299€/mes - Hasta 20 usuarios
      Plan Enterprise: Contactar - Usuarios ilimitados
    `,
  },
  {
    title: "Características del Sistema",
    content: `
      - Gestión de clientes (CRM)
      - Automatización de ventas
      - Reportes en tiempo real
      - Integraciones con +100 apps
    `,
  },
];

for (const doc of documents) {
  await fetch('http://localhost:3000/api/rag/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  });
}
```

## 🧪 Probar el Agente

1. Abre `http://localhost:3000`
2. Haz clic en el botón flotante del chat (esquina inferior derecha)
3. Interactúa con el agente:
   - Haz preguntas sobre tu producto/servicio
   - El agente te guiará naturalmente a proporcionar tus datos
   - Prueba agendar una reunión

## 🚢 Despliegue a Producción

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel Dashboard
# Project Settings → Environment Variables
```

### Opción 2: Otro Hosting

El proyecto es una aplicación Next.js estándar que puede desplegarse en cualquier plataforma que soporte Node.js.

## 📂 Estructura del Proyecto

```
lead-agent-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts          # API principal del chat
│   │   │   └── rag/ingest/route.ts    # API para cargar documentos
│   │   └── page.tsx                    # Página de demo
│   ├── components/
│   │   └── chat-widget/
│   │       ├── ChatWidget.tsx          # Widget principal
│   │       └── ChatBubble.tsx          # Componente de mensaje
│   └── lib/
│       ├── supabase.ts                 # Cliente Supabase
│       ├── openai.ts                   # Cliente OpenAI
│       ├── rag-engine.ts               # Motor RAG
│       ├── odoo-client.ts              # Cliente Odoo
│       └── prompts/
│           └── sales-agent.ts          # Prompts del agente
├── supabase-schema.sql                 # Schema de base de datos
├── .env.local                          # Variables de entorno
└── README.md                           # Este archivo
```

## 🔧 Personalización

### Cambiar la Tonalidad del Agente

Edita `src/lib/prompts/sales-agent.ts`:

```typescript
export const SALES_AGENT_SYSTEM_PROMPT = `
Eres un asistente [CAMBIA AQUÍ: más formal / más casual / más técnico]
...
`;
```

### Añadir Campos Personalizados de Captura

1. Actualiza el schema en `supabase-schema.sql`
2. Modifica los tipos en `src/lib/supabase.ts`
3. Actualiza las funciones en `src/app/api/chat/route.ts`

### Personalizar Colores del Widget

Edita `src/components/chat-widget/ChatWidget.tsx`:

```typescript
// Cambiar gradiente principal
className="bg-gradient-to-r from-indigo-600 to-purple-600"
// Por ejemplo:
className="bg-gradient-to-r from-blue-600 to-cyan-600"
```

## 🐛 Troubleshooting

### El chat no responde

1. Verifica que las variables de entorno estén configuradas
2. Revisa la consola del navegador (F12) para errores
3. Verifica que el servidor esté corriendo (`npm run dev`)

### Errores de Supabase

1. Asegúrate de haber ejecutado `supabase-schema.sql`
2. Verifica que la extensión `pgvector` esté habilitada
3. Comprueba los permisos de RLS (Row Level Security)

### Odoo no sincroniza

1. Verifica las credenciales en `.env.local`
2. Revisa los logs del servidor para ver errores específicos
3. El cliente de Odoo está preparado pero requiere que completes las credenciales

## 🔧 Configuración de Odoo en Detalle

### ⚠️ Problema Común: ¿Email del Buzón vs Email del Usuario?

**IMPORTANTE**: El `ODOO_USERNAME` NO es el email donde recibes correos del CRM.

- ✅ **Correcto**: Email con el que inicias sesión en Odoo (tu usuario)
- ❌ **Incorrecto**: Email configurado para recibir correos de clientes

**Ejemplo:**

```env
# ❌ INCORRECTO
ODOO_USERNAME=ventas@realtodigital.com  # Este es el buzón de recepción

# ✅ CORRECTO
ODOO_USERNAME=admin@realtodigital.com   # Este es tu usuario de Odoo
```

### 📚 Guías Detalladas

- **Configuración paso a paso**: Ver `docs/SETUP-ODOO.md`
- **Email vs XML-RPC**: Ver `docs/ODOO-EMAIL-VS-XMLRPC.md`

### 🧪 Script de Diagnóstico

Para verificar si la integración funciona correctamente:

```bash
npx tsx scripts/diagnose-odoo.ts
```

Este script te indicará exactamente qué está mal y cómo solucionarlo.

### ✅ Checklist de Configuración Odoo

- [ ] `ODOO_URL` es la URL raíz (sin `/odoo` al final)
- [ ] `ODOO_DB` es el nombre correcto de la base de datos
- [ ] `ODOO_USERNAME` es el email de tu usuario de Odoo (no del buzón)
- [ ] `ODOO_PASSWORD` es correcta
- [ ] Tu usuario tiene permisos de CRM/Ventas en Odoo
- [ ] Puedes iniciar sesión en Odoo con esas credenciales

---

## 📄 Licencia

MIT

## 🤝 Soporte

Para dudas o problemas, abre un issue en el repositorio.

---

**Desarrollado con ❤️ usando Next.js, Supabase y OpenAI**
