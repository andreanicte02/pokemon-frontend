# Criterios de deps-triage

Cómo decidir. Igual para todos los repos; lo propio de cada repo está en `CONFIG.md`. Si la skill se equivoca en un veredicto, **se corrige aquí** con un PR normal.

---

## 1. ¿Nos afecta?

| Pregunta | Cómo se verifica |
|---|---|
| ¿Runtime o solo desarrollo? | `package.json` (`dependencies` vs `devDependencies`) |
| ¿Llega al bundle? | `pnpm why <pkg> --prod` (si no aparece, no llega) |
| ¿Por qué cadena llega? | `pnpm why <pkg>` |
| ¿Se usa la función vulnerable? | Grep de imports y llamadas en `src/` |
| ¿Recibe input no confiable? | El código que la usa (URL, formularios, respuestas del API) |
| ¿Toca un módulo sensible? | Los de `CONFIG.md` pesan más |
| ¿Aplica al tipo de app? | "Tipo de app" de `CONFIG.md` (ej. en una SPA no aplica lo de servidor Node) |

## 2. Veredictos

| Veredicto | Cuándo |
|---|---|
| 🔴 **Importante** | Malware; o runtime + llega al bundle + (función usada o input no confiable); o módulo sensible con severidad alta |
| 🟡 **Revisar** | Runtime con severidad media/alta sin evidencia clara de uso; cambios de comportamiento en release notes |
| 🟢 **No afecta / puede esperar** | Solo build/lint/test, función no usada, o no aplica al tipo de app |
| ⚪ **No pude verificar** | Falta información, scripts de install nuevos, cambio de quien publica, duda razonable |

Precedencia: 🔴 > ⚪ > 🟡 > 🟢. El estado general es el peor veredicto.

- Si no puedes verificar algo, dilo y usa ⚪. **Nunca** infieras "no aplica" sin evidencia.
- Todo 🔴 va arriba del reporte, con qué hacer y en qué orden.

## 3. Transitivas con alerta

Recorre la cadena hasta la directa y decide **un** caso:

| # | Caso | Qué hacer |
|---|---|---|
| 1 | **No nos afecta** (no llega a producción, o no usamos la función) | No subir nada. Proponer descartarla, con la cadena como evidencia |
| 2 | Nos afecta y una versión nueva (patch/minor, no deprecated, con cooldown) de la **directa arrastra el parche** | Subir la directa + `pnpm why <transitiva>` con la versión mínima esperada |
| 3 | Nos afecta y el rango del padre **ya permite** el parche (solo falta refrescar el lockfile) | `pnpm update <paquete a refrescar>` + `pnpm why` de verificación. `package.json` no cambia |
| 4 | Nos afecta y no hay otra salida | `overrides` en `package.json`, **solo** si llega a producción y todas sus copias son del mismo major (un override las unifica). Si no, dejarla abierta con explicación. 🔴/🟡 arriba |

**Cómo comprobar el caso 2:** `dependencies` de `https://registry.npmjs.org/<directa>/<nueva>` y bajar por la cadena hasta ver que el rango exigido **excluye** la versión vulnerable. Si todavía la permite, pnpm conserva la del lockfile: eso es caso 3.

**Ejemplo (`js-yaml` 4.2.0 → 4.3.2):** `eslint 9.39.4 → @eslint/eslintrc ^3.3.5 → js-yaml 4.2.0`. `eslint@9.39.5` arrastraría el parche, pero está deprecated (salió la 10). `@eslint/eslintrc@3.3.7` exige `js-yaml ^4.3.2` y `^3.3.5` ya lo permite → caso 3: `pnpm update @eslint/eslintrc` + `pnpm why js-yaml` ≥ 4.3.2. Como `js-yaml` es solo de lint, el caso 1 también vale; preferir corregir si es barato.

Las predicciones de los casos 2 y 3 **siempre** se verifican con `pnpm why` después de aplicarlas.

## 4. Directas (lo que trae el PR de Dependabot)

| Caso | Qué hacer |
|---|---|
| Patch/minor normal | 🟢 salvo que el changelog diga otra cosa. "Qué probar" según dónde se usa (grep) |
| **Scripts de install nuevos** o cambio de quien publica (`_npmUser`) | ⚪: pedir revisión antes de mergear |
| Toda la línea está **deprecated** (ej. `eslint` 9.x al salir la 10) | Ficha de major y resolver las alertas de su cadena como transitivas |
| Según el changelog **requiere cambios de código** | 🟡 con los archivos afectados |
| Congelada (`CONFIG.md`) | No debería venir (Dependabot la ignora). Si viene, avisar |
| **Malware** en una versión instalada | 🔴 arriba: subir a la última versión sana (o `overrides`). Si no hay, acción manual |

## 5. Majors

- **Nunca** se aplican desde la skill. Por cada major disponible de una directa, una ficha: versión actual → nueva, link al changelog o guía, breaking changes **que nos tocan** con archivos (grep), los que no nos tocan en una línea, esfuerzo (bajo / medio / alto) y si depende de otro major.
- Las familias de `CONFIG.md` van completas.
- Si un major es la **única** solución de una alerta que llega a producción: 🔴 arriba.

## 6. Descartes

No se descartan alertas: **se proponen** y una persona las descarta en GitHub (Security → Dependabot → Dismiss). Solo con evidencia, la cadena y un "Revaluar si…". Ej.: `eslint → … → undici. Solo de lint, no llega a dist/. Revaluar si undici se usa en runtime.`

## 7. Qué probar

Para alguien que **no conoce las librerías**: qué cambió sin jerga, dónde se nota (pantallas concretas, a partir del grep) y pasos cortos. Si es tooling: "no requiere prueba manual; basta con que el build pase".

---

## 8. Plantilla del reporte

Se muestra en el chat y, con OK, va como comentario del PR. Omitir secciones vacías, salvo "Antes de mergear".

````markdown
## 🤖 Triage de dependencias
**Estado general:** 🟢 No afecta
_Revisión: AAAA-MM-DD · PR #<n> · base <rama>@<sha corto>_

### 🚨 Atender primero
(solo si hay 🔴 — qué pasa, qué hacer, en qué orden)

### 📦 Qué trae el PR
| Paquete | Cambio | Veredicto | Por qué |
|---|---|---|---|

### 🔔 Alertas abiertas
| Alerta | Paquete | Cadena | ¿Nos afecta? | Qué hacer (caso 1–4) |
|---|---|---|---|---|

### 🙋 Descartes propuestos (se descartan a mano en Security → Dependabot)
| Alerta | Paquete | Por qué no nos afecta | Revaluar si… |
|---|---|---|---|

### 💻 Comandos
```sh
pnpm update <paquete>        # solo casos 3
pnpm why <transitiva>         # debe mostrar ≥ <versión>
```

### 🧪 Qué probar
- **<Qué cambió>** (`<paquete>`): <dónde se nota y pasos>

### 💥 Majors disponibles
<details><summary><paquete> <actual> → <nueva> — esfuerzo <…></summary>

…ficha…
</details>

### ✅ Validación y antes de mergear
- [ ] Install del lockfile · build · lint de seguridad · audit (resultado de cada uno si la skill los corrió)
- [ ] Revisé lo de "Qué probar"
- [ ] Descarté las alertas propuestas
````
