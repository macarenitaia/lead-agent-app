# Architecture Decision Record: Tenant Separation Fix

## Status

Proposed

## Context

Se detectó que los datos de la base de conocimiento de Psicofel y Real to Digital se estaban guardando bajo el mismo `tenant_id`. Esto causaba una filtración de contexto donde el chatbot de un cliente podía responder con información del otro.

La causa raíz fue que los scripts de ingesta (`ingest-kb.ts`) estaban configurados para obtener la primera organización de la base de datos sin filtrar por cliente, y el frontend (`ChatWidget.tsx`) tenía un ID hardcodeado que correspondía a Psicofel.

## Decision

1. **Creación de Organizaciones Únicas**: Cada cliente (Real to Digital, Psicofel) tendrá su propio UUID en la tabla `organizations`.
2. **Migración de Datos**: Se moverán todos los registros de `knowledge_embeddings` que contengan "Real to Digital" en su contenido o metadatos al nuevo tenant.
3. **Parametrización del Frontend**: El `ChatWidget` dejará de usar un ID hardcodeado. En su lugar, el `tenantId` deberá ser inyectado (por ejemplo, mediante una prop `tenantId` en el componente).

## Consequences

- Se garantiza el determinismo y la privacidad de los datos por cliente.
- Los desarrolladores deberán especificar el ID del tenant correcto al realizar ingestas o pruebas.
- Se requiere una actualización en la forma en que se instancia el componente `ChatWidget` en las páginas de cada cliente.

## Prevention Rule

"Jamás usar `.limit(1)` en consultas de la tabla `organizations` para obtener el tenant por defecto. Siempre filtrar explícitamente por `slug` o `external_id`."
