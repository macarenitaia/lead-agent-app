# 🚀 Guía Rápida: Configurar Integración Odoo

## Paso 1: Completa las Variables de Entorno

Edita el archivo `.env.local` en la raíz del proyecto:

```env
# ============================================
# ODOO CONFIGURATION
# ============================================
ODOO_URL=
ODOO_DB=
ODOO_USERNAME=
ODOO_PASSWORD=
```

---

## Paso 2: Obtén la Información de Odoo

### 🌐 ODOO_URL

**Cómo obtenerla:**

1. Inicia sesión en tu cuenta de Odoo
2. Mira la URL en el navegador
3. Copia solo la parte raíz

**Ejemplos:**

```
✅ CORRECTO:
   https://realtodigital.odoo.com
   https://miempresa.odoo.com
   
❌ INCORRECTO:
   https://realtodigital.odoo.com/odoo
   https://realtodigital.odoo.com/web
   https://realtodigital.odoo.com/web/login
```

---

### 📊 ODOO_DB

**Cómo obtenerla:**

**Opción 1 - Desde la URL:**

- A veces aparece en la URL: `?db=nombre_base_datos`

**Opción 2 - Pregunta a soporte:**

- Si usas Odoo.com, contacta a soporte
- Si tienes Odoo autohospedado, pregunta al administrador

**Opción 3 - Prueba el nombre de tu empresa:**

- Suele ser: `realtodigital` o `realtodigital-production`

**Ejemplos:**

```
realtodigital
realtodigital-prod
rtd-odoo
```

---

### 👤 ODOO_USERNAME

**¡IMPORTANTE!** Este NO es el email donde recibes correos del CRM.

**Es el email con el que inicias sesión en Odoo:**

1. Ve a Odoo (web)
2. Haz clic en tu perfil (esquina superior derecha)
3. Verás tu nombre y email
4. **Ese email** es tu `ODOO_USERNAME`

**Ejemplos:**

```
admin@realtodigital.com
carlos@realtodigital.com
tu-email@realtodigital.com
```

---

### 🔐 ODOO_PASSWORD

**La contraseña de tu usuario de Odoo**

- Es la que usas para iniciar sesión en Odoo
- NO es la contraseña del buzón de email

**Alternativa (Odoo 13+):**

- Puedes usar un API Token en vez de contraseña
- Ve a: Preferencias → Seguridad → API Keys

---

## Paso 3: Verifica Permisos del Usuario

Tu usuario de Odoo debe tener permisos de CRM:

1. Ve a: **Ajustes** → **Usuarios y Compañías** → **Usuarios**
2. Busca tu usuario
3. En **Derechos de Acceso**, asegúrate que tenga:
   - ✅ **Ventas** (Sales)
   - ✅ **CRM** (si existe como opción independiente)

---

## Paso 4: Prueba la Conexión

Ejecuta el script de diagnóstico:

```bash
npx tsx scripts/diagnose-odoo.ts
```

### Resultado Esperado

```
✅ ¡ÉXITO! La integración está funcionando
🎯 Lead creado en Odoo con ID: 12345
```

### Si Hay Errores

Lee los mensajes del script, te indicará exactamente qué está mal:

- ❌ Credenciales incorrectas → Verifica usuario/contraseña
- ❌ Base de datos incorrecta → Verifica el nombre
- ❌ Sin permisos → Dale permisos de CRM al usuario
- ❌ URL incorrecta → Verifica el formato

---

## Paso 5: Verifica en Odoo

1. Inicia sesión en Odoo (web)
2. Ve a: **CRM** → **Leads**
3. Busca el lead de prueba creado por el script
4. Debería aparecer con el nombre: `Test Lead - Diagnóstico [fecha]`

---

## ⚠️ Problemas Comunes

### "Authentication failed: Invalid credentials"

**Causas:**

- Usuario o contraseña incorrectos
- Nombre de base de datos incorrecto

**Solución:**

1. Verifica que puedes iniciar sesión en Odoo (web) con esas credenciales
2. Comprueba que el nombre de la base de datos sea correcto
3. Si usas varios entornos (producción/pruebas), asegúrate de usar el correcto

---

### "Error: User does not have access to CRM"

**Causas:**

- El usuario no tiene permisos de CRM en Odoo

**Solución:**

1. Ve a: Ajustes → Usuarios → [Tu Usuario]
2. Marca la casilla de "Ventas" o "CRM"
3. Guarda cambios
4. Vuelve a intentar

---

### "ENOTFOUND" o "Connection refused"

**Causas:**

- URL incorrecta
- Odoo no está accesible desde tu red

**Solución:**

1. Verifica que puedes acceder a la URL desde el navegador
2. Comprueba que no haya firewall bloqueando el puerto
3. Si es Odoo autohospedado, verifica que el servicio esté corriendo

---

## 📝 Ejemplo Completo de .env.local

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=TU_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY

# ============================================
# OPENAI CONFIGURATION
# ============================================
OPENAI_API_KEY=TU_OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini

# ============================================
# ODOO CONFIGURATION
# ============================================
ODOO_URL=https://realtodigital.odoo.com
ODOO_DB=realtodigital-production
ODOO_USERNAME=admin@realtodigital.com
ODOO_PASSWORD=MiContraseñaSegura123

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TENANT_ID=612d5347-5745-4b4a-b69c-70087e6a7e8b
```

---

## 🎯 Checklist Final

Antes de ejecutar el script, verifica:

- [ ] URL de Odoo es correcta y NO termina en `/odoo`
- [ ] Nombre de base de datos es correcto
- [ ] Email del usuario es el que usas para login en Odoo
- [ ] Contraseña es correcta
- [ ] El usuario tiene permisos de CRM/Ventas
- [ ] Puedes acceder a Odoo desde el navegador

---

## 🆘 ¿Necesitas Ayuda?

Si después de seguir esta guía aún tienes problemas:

1. Ejecuta: `npx tsx scripts/diagnose-odoo.ts`
2. Copia el output completo del error
3. Lee el documento: `docs/ODOO-EMAIL-VS-XMLRPC.md`
