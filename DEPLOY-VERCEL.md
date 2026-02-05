# 🚀 DEPLOY A VERCEL - PASO A PASO

## ✅ ODOO FUNCIONANDO - CONFIRMADO

```
✅ Lead #66 creado en Odoo exitosamente
📧 Email: diagnostico@realtodigital.com
📛 Nombre: Test Lead - Diagnóstico 5/2/2026, 9:36:45
```

**La integración con Odoo está 100% funcionando localmente.**

---

## 📦 GIT COMMIT REALIZADO

```
✅ Initial commit realizado
📊 58 archivos, 13,510 líneas
🔑 .env.local NO incluido (protegido por .gitignore)
```

---

## 🔗 PASO 1: Conectar con GitHub

### Opción A: Crear Nuevo Repositorio en GitHub

1. **Ve a GitHub:**

   ```
   https://github.com/new
   ```

2. **Crea el repositorio:**
   - Repository name: `realtodigital-chatbot` (o el que prefieras)
   - Descripción: `AI-powered chatbot for Real to Digital with Odoo integration`
   - **Visibilidad:** Private (recomendado)
   - **NO** marques "Initialize this repository with a README"

3. **Copia la URL del repositorio** (algo como):

   ```
   https://github.com/TU-USUARIO/realtodigital-chatbot.git
   ```

### Opción B: Usar Repositorio Existente

Si ya tienes un repositorio, copia su URL.

---

## 🚀 PASO 2: Push a GitHub

Una vez tengas la URL del repositorio, ejecuta estos comandos:

```bash
# Conectar con el repositorio remoto
git remote add origin https://github.com/TU-USUARIO/realtodigital-chatbot.git

# O si es GitLab u otro:
# git remote add origin https://gitlab.com/TU-USUARIO/realtodigital-chatbot.git

# Cambiar el nombre de la rama a main (si es necesario)
git branch -M main

# Push al repositorio
git push -u origin main
```

---

## ☁️ PASO 3: Deploy en Vercel

### 3.1 Importar Proyecto

1. **Ve a Vercel:**

   ```
   https://vercel.com/new
   ```

2. **Importa desde GitHub:**
   - Busca tu repositorio: `realtodigital-chatbot`
   - Click en **"Import"**

### 3.2 Configurar Variables de Entorno

**IMPORTANTE:** En Vercel, ve a **"Environment Variables"** y agrega TODAS estas:

```env
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=TU_URL_DE_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY

# OPENAI
OPENAI_API_KEY=TU_OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini

# ODOO
ODOO_URL=TU_URL_DE_ODOO
ODOO_DB=TU_NOMBRE_DE_DB
ODOO_USERNAME=TU_USUARIO
ODOO_PASSWORD=TU_PASSWORD

# APP CONFIG
NEXT_PUBLIC_APP_URL=https://TU-PROYECTO.vercel.app
NEXT_PUBLIC_TENANT_ID=7c3130fe-fcbd-4f48-9cd2-d6fd85a2e047
```

**⚠️ IMPORTANTE:**

- Copia TODAS las variables
- Reemplaza `NEXT_PUBLIC_APP_URL` con tu URL de Vercel después del deploy

### 3.3 Deploy

1. Click en **"Deploy"**
2. Espera 1-2 minutos
3. ✅ Verás: **"Your project has been deployed"**

---

## 🧪 PASO 4: Verificar el Deploy

Una vez desplegado:

1. **Abre la URL de Vercel** (algo como `https://realtodigital-chatbot.vercel.app`)

2. **Prueba el chatbot:**
   - Haz una pregunta: "¿Qué servicios ofrece Real to Digital?"
   - Debería responder con información de la base de conocimiento

3. **Verifica Odoo:**
   - Proporciona tu email en el chat
   - Ve a tu CRM de Odoo
   - Deberías ver el lead creado automáticamente

---

## ⚙️ PASO 5: Actualizar URL en .env

Después del deploy, actualiza la variable de entorno en Vercel:

```env
NEXT_PUBLIC_APP_URL=https://TU-PROYECTO-REAL.vercel.app
```

Y haz **"Redeploy"** desde el dashboard de Vercel.

---

## 🔄 FUTURAS ACTUALIZACIONES

Para actualizar el código en producción:

```bash
# 1. Haz cambios en el código
# 2. Commit
git add .
git commit -m "Descripción de cambios"

# 3. Push
git push origin main

# 4. Vercel detectará automáticamente y re-desplegará
```

---

## 📊 MONITOREO

### En Vercel Dashboard

- **Deployments:** Ver historial de deploys
- **Function Logs:** Ver logs de las API routes
- **Analytics:** Estadísticas de uso

### En Odoo

- **CRM → Leads:** Ver leads creados por el chatbot

---

## 🆘 TROUBLESHOOTING

### Error: "Environmental variables not set"

**Solución:** Verifica que copiaste TODAS las variables en Vercel

### Error: "Supabase connection failed"

**Solución:**

- Verifica que las URLs y keys son correctas
- Asegúrate de que las políticas RLS permiten conexiones

### Error: "Odoo lead not created"

**Solución:**

- Verifica credenciales de Odoo
- Revisa logs en Vercel → Functions

### El chatbot no responde correctamente

**Solución:**

- Verifica que ejecutaste `supabase-function-rag.sql`
- Confirma que hay documentos en `knowledge_embeddings`

---

## ✅ CHECKLIST PRE-DEPLOY

- [ ] Commit realizado ✅
- [ ] Repositorio GitHub creado
- [ ] Push realizado
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy completado
- [ ] URL actualizada en variables
- [ ] Chatbot probado
- [ ] Integración Odoo verificada

---

## 🎉 ¡LISTO PARA PRODUCCIÓN

Tu chatbot estará disponible 24/7 en:

```
https://TU-PROYECTO.vercel.app
```

Con:

- ✅ IA conversacional (GPT-4)
- ✅ Base de conocimiento RAG
- ✅ Integración automática con Odoo
- ✅ Arquitectura multitenant
- ✅ Escalabilidad automática

---

**¿Necesitas ayuda con algún paso específico?** 🚀
