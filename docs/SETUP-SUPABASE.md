# 🗄️ Guía: Ejecutar Esquema SQL en Supabase

## ✅ Estado Actual

- ✅ Supabase conectado
- ✅ OpenAI funcionando
- ✅ Odoo funcionando
- ⏳ **FALTA:** Crear tablas en Supabase

---

## 📝 Pasos para Ejecutar el Esquema

### 1️⃣ Abrir Supabase Dashboard

Ve a: **<https://supabase.com/dashboard/project/rsbgkjkmvogbptpkklbm>**

(O desde: <https://supabase.com> → Selecciona tu proyecto)

---

### 2️⃣ Ir al SQL Editor

En el menú lateral izquierdo, busca y haz clic en:

```
🔧 SQL Editor
```

---

### 3️⃣ Crear Nueva Query

1. Haz clic en el botón **"New query"** (esquina superior izquierda)
2. Se abrirá un editor SQL en blanco

---

### 4️⃣ Copiar el Esquema

**Opción A - Desde VS Code:**

1. Abre el archivo: `supabase-schema.sql`
2. Selecciona todo (`Ctrl+A`)
3. Copia (`Ctrl+C`)

**Opción B - Desde este comando:**

```bash
cat supabase-schema.sql
```

---

### 5️⃣ Pegar y Ejecutar

1. **Pega** el contenido en el editor SQL de Supabase (`Ctrl+V`)
2. **Ejecuta** haciendo clic en **"Run"** o presionando `Ctrl+Enter`
3. **Espera** unos segundos

---

### 6️⃣ Verificar Resultado

Deberías ver mensajes como:

```
✓ CREATE EXTENSION
✓ CREATE TABLE
✓ CREATE INDEX
✓ CREATE FUNCTION
✓ CREATE TRIGGER
✓ CREATE POLICY
```

**Si hay errores del tipo "already exists"**, está bien, ignóralos.

---

### 7️⃣ Verificar que Funcionó

Vuelve a ejecutar en tu terminal:

```bash
npm run verify:setup
```

Deberías ver:

```
✅ Conexión con Supabase exitosa
✅ Tabla knowledge_base existe
╔════════════════════════════════════════════════════╗
║  ✅ ¡TODO CONFIGURADO CORRECTAMENTE!              ║
╚════════════════════════════════════════════════════╝
```

---

## 🎯 ¿Qué Crea Este Esquema?

### Tablas Principales

1. **`conversations`** - Historial de chats
2. **`messages`** - Mensajes individuales
3. **`leads`** - Información de leads capturados
4. **`knowledge_base`** - Base de conocimiento para RAG

### Características Avanzadas

- ✅ **pgvector** habilitado para búsqueda semántica
- ✅ Índices optimizados para performance
- ✅ Función `search_knowledge()` para RAG
- ✅ Triggers para actualizar timestamps
- ✅ Row Level Security (RLS) configurado

---

## 🆘 Problemas Comunes

### "Permission denied"

**Solución:** Asegúrate de estar logueado con el usuario correcto que tiene permisos de administrador del proyecto.

### "Extension vector does not exist"

**Solución:** pgvector debería habilitarse automáticamente. Si no, ve a **Database** → **Extensions** y habilita `vector`.

### "Already exists"

**Solución:** No pasa nada, significa que ya se ejecutó antes. Puedes ignorar estos mensajes.

---

## 🚀 Después de Ejecutar el SQL

Una vez que el esquema esté creado:

```bash
# 1. Verifica que todo funciona
npm run verify:setup

# 2. Carga la base de conocimiento
npm run ingest:kb

# 3. Inicia el servidor
npm run dev

# 4. Abre en el navegador
http://localhost:3000
```

---

## 📊 Estado del Proyecto

| Componente | Estado |
|------------|--------|
| Variables de Entorno | ✅ Completo |
| Supabase Conexión | ✅ Completo |
| Supabase Esquema | ⏳ **ESTE PASO** |
| OpenAI | ✅ Completo |
| Odoo | ✅ Completo |
| Base de Conocimiento | ⏳ Siguiente |
| Servidor Dev | ⏳ Final |

---

¡Casi terminamos! Solo falta ejecutar este SQL y estarás listo para usar el chatbot. 🎉
