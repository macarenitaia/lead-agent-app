# 🚀 GUÍA DE INICIO RÁPIDO - Solución Integración Odoo

## 📦 Lo Que He Creado Para Ti

He preparado todo lo necesario para que puedas diagnosticar y solucionar el problema de integración con Odoo:

### 📄 Archivos Nuevos

1. **`.env.local`** - Plantilla de configuración
2. **`scripts/diagnose-odoo.ts`** - Script de diagnóstico inteligente
3. **`docs/SETUP-ODOO.md`** - Guía paso a paso
4. **`docs/ODOO-EMAIL-VS-XMLRPC.md`** - Explicación detallada
5. **`docs/RESUMEN-ODOO.md`** - Resumen ejecutivo (LEE ESTE PRIMERO)
6. **`package.json`** (actualizado) - Scripts npm añadidos

---

## ⚡ INICIO RÁPIDO - 3 PASOS

### Paso 1: Instala Dependencias (si no lo has hecho)

```bash
npm install
```

### Paso 2: Edita `.env.local`

Abre el archivo `.env.local` en la raíz del proyecto y completa:

```env
# Información de tu Odoo
ODOO_URL=https://tu-empresa.odoo.com
ODOO_DB=nombre_base_datos
ODOO_USERNAME=tu-email@realtodigital.com
ODOO_PASSWORD=tu_contraseña

# Información de Supabase (ya tienes la URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# OpenAI
OPENAI_API_KEY=sk-proj-...
```

### Paso 3: Ejecuta el Diagnóstico

```bash
npm run diagnose:odoo
```

O alternativamente:

```bash
npx tsx scripts/diagnose-odoo.ts
```

---

## 📖 ¿Qué Hace el Script de Diagnóstico?

El script verificará automáticamente:

1. ✅ Variables de entorno configuradas
2. ✅ Formato correcto de URL
3. ✅ Conexión con Odoo
4. ✅ Autenticación
5. ✅ Permisos de CRM
6. ✅ Creación de lead de prueba

**Resultado esperado:**

```
✅ ¡ÉXITO! La integración está funcionando
🎯 Lead creado en Odoo con ID: 12345
```

---

## 🎯 Respuesta a Tu Pregunta Original

> "¿Puede ser porque el email configurado en Odoo para recibir correos es otro?"

### Respuesta: NO

**Son dos cosas diferentes:**

| Concepto | Qué es | Email a usar |
|----------|--------|--------------|
| **Email del buzón** | Para recibir correos de clientes | `ventas@realtodigital.com` |
| **ODOO_USERNAME** | Usuario para login XML-RPC | `admin@realtodigital.com` (tu usuario) |

**No están relacionados.** Tu chatbot usa XML-RPC (API), no email.

---

## 🛠️ Scripts NPM Disponibles

Ahora tienes estos comandos:

```bash
# Desarrollo
npm run dev                # Iniciar servidor de desarrollo

# Diagnóstico Odoo
npm run diagnose:odoo      # Script completo de diagnóstico (USA ESTE)
npm run test:odoo          # Test simple de conexión

# RAG (Base de conocimiento)
npm run ingest:kb          # Cargar base de conocimiento
npm run test:rag           # Probar búsqueda semántica

# Producción
npm run build              # Compilar para producción
npm start                  # Iniciar en producción
```

---

## 📚 Documentación Detallada

Si necesitas más información:

1. **`docs/RESUMEN-ODOO.md`** ← ⭐ EMPIEZA AQUÍ
2. **`docs/SETUP-ODOO.md`** ← Configuración paso a paso
3. **`docs/ODOO-EMAIL-VS-XMLRPC.md`** ← Explicación técnica
4. **`README.md`** ← Documentación general del proyecto

---

## ⚠️ Problemas Comunes y Soluciones

### "Authentication failed"

**Causa:** Usuario/contraseña incorrectos  
**Solución:** Verifica que puedes iniciar sesión en Odoo web con esas credenciales

### "Database not found"

**Causa:** Nombre de base de datos incorrecto  
**Solución:** Pregunta a tu proveedor de Odoo o verifica en la URL

### "User does not have CRM access"

**Causa:** Usuario sin permisos  
**Solución:** Ve a Odoo → Ajustes → Usuarios → Dale permisos de "Ventas"

### "ENOTFOUND"

**Causa:** URL incorrecta o Odoo no accesible  
**Solución:** Verifica la URL y que puedes acceder desde el navegador

---

## 🎓 Cómo Obtener las Credenciales

### ODOO_URL

1. Inicia sesión en Odoo
2. Mira la URL en el navegador
3. Copia solo: `https://tuempresa.odoo.com`

### ODOO_DB

1. Pregunta a soporte de Odoo
2. O mira si aparece en la URL: `?db=nombre`
3. Suele ser el nombre de tu empresa

### ODOO_USERNAME

1. Ve a tu perfil en Odoo (esquina superior derecha)
2. El email que ves ahí es tu `ODOO_USERNAME`
3. **NO** uses el email del buzón de correos

### ODOO_PASSWORD

- La contraseña que usas para login en Odoo
- O API Token (Preferencias → Seguridad → API Keys)

---

## ✅ Checklist Final

Antes de ejecutar el diagnóstico:

- [ ] He instalado dependencias (`npm install`)
- [ ] He editado `.env.local` con mis credenciales reales
- [ ] ODOO_URL no termina en `/odoo`
- [ ] ODOO_USERNAME es mi email de usuario de Odoo (no del buzón)
- [ ] Puedo iniciar sesión en Odoo web con esas credenciales
- [ ] Mi usuario tiene permisos de CRM en Odoo

---

## 🆘 ¿Necesitas Ayuda?

1. Lee `docs/RESUMEN-ODOO.md` (3 minutos de lectura)
2. Ejecuta `npm run diagnose:odoo`
3. Lee el output del script - te dirá exactamente qué está mal
4. Si persiste el error, revisa `docs/SETUP-ODOO.md`

---

## 🎯 Siguiente Paso

```bash
# ¡Ejecuta esto ahora!
npm run diagnose:odoo
```

El script validará todo y te dirá exactamente qué necesitas corregir.

---

## 📊 Flujo de la Integración

```
Usuario chatea → ChatWidget → /api/chat → searchKnowledge (RAG)
                                   ↓
                              OpenAI GPT-4
                                   ↓
                       Function Call (captura datos)
                                   ↓
                          Guarda en Supabase
                                   ↓
                      Sincroniza con Odoo (XML-RPC) ✅
                                   ↓
                          Lead creado en CRM
```

**La integración de email NO participa en este flujo.**

---

## 💡 Conclusión

Tu problema **NO** es el email del buzón de correos.

**Posibles causas:**

1. Credenciales incorrectas en `.env.local`
2. Usuario sin permisos de CRM
3. Base de datos o URL incorrectas

**Solución:**
Ejecuta `npm run diagnose:odoo` y sigue las instrucciones.

---

¡Mucha suerte! 🚀
