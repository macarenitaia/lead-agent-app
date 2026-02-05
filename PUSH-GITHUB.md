# 🚀 COMANDOS PARA PUSH A GITHUB

## ✅ Odoo Funcionando - Confirmado

**Lead #66 creado exitosamente en Odoo CRM**

---

## 📝 EJECUTA ESTOS COMANDOS EN ORDEN

### 1️⃣ Conectar con el repositorio GitHub `lead-agent-app`

```bash
git remote add origin https://github.com/TU-USUARIO/lead-agent-app.git
```

**⚠️ Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub**

---

### 2️⃣ Cambiar rama a main

```bash
git branch -M main
```

---

### 3️⃣ Push al repositorio

```bash
git push -u origin main
```

---

## 🌐 DEPLOY EN VERCEL

1. **Ve a:** <https://vercel.com/new>

2. **Importa:** `lead-agent-app` desde GitHub

3. **Configura estas variables de entorno:**

```
NEXT_PUBLIC_SUPABASE_URL=TU_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_KEY
OPENAI_API_KEY=TU_KEY
OPENAI_MODEL=gpt-4o-mini
ODOO_URL=https://real-to-digital-3d.odoo.com
ODOO_DB=real-to-digital-3d
ODOO_USERNAME=angel@realtodigital3d.com
ODOO_PASSWORD=TU_PASS
NEXT_PUBLIC_APP_URL=https://lead-agent-app.vercel.app
NEXT_PUBLIC_TENANT_ID=7c3130fe-fcbd-4f48-9cd2-d6fd85a2e047
```

1. **Deploy** → Listo! 🎉

---

## 📊 ESTADO ACTUAL

✅ **Local:** <http://localhost:3000> (corriendo)
✅ **Odoo:** Lead #66 creado (integración funcionando)
✅ **Git:** Commit realizado (58 archivos)
⏳ **GitHub:** Esperando push
⏳ **Vercel:** Esperando deploy
