# Configuración de GitHub y Claude

> Los archivos ya están armados (`.github/workflows/*.yml`, `dependabot.yml`, `instructions/`). Esta guía es lo que **no** se puede commitear: secrets, toggles de Settings y permisos. Hacerlo una vez por repo, en este orden.

**Requisitos:** el repo en GitHub, rol **admin** del repo (si carga `https://github.com/<owner>/<repo>/settings/security_analysis`, lo sos), y en local `gh` autenticado (`gh auth login`) y la CLI de Claude Code.

---

## 1. Claude revisa PRs (`workflows/claude.yml`)

Claude responde **solo** cuando alguien lo menciona con `@claude` en un PR o issue. Tiene permiso de lectura sobre el código: **no puede pushear** (GitHub le rechaza el push por `contents: read`, no es una convención).

### 1.1 Cargar el token

- [ ] Generar el token con tu cuenta de Claude (Pro/Max):
  ```bash
  claude setup-token
  ```
- [ ] Cargarlo como **secret de repositorio**:
  ```bash
  gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo <owner>/<repo>
  ```

Cuidado con:
- **Secret de repositorio, NO de environment.** Los de environment solo llegan a jobs que declaran ese `environment:`; este no declara ninguno y el token llegaría vacío.
- Es un token **de tu cuenta, no del repo**: sirve para todos tus repos, pero hay que cargarlo en cada uno (o una vez como secret de organización, si sos owner).
- **Regenerarlo invalida el anterior**: actualizarlo en todos los repos que lo usen. Expira en ~1 año.
- **Costo:** el uso de Claude sale de **tu suscripción** (la misma cuota que usás en local; al agotarse, el job falla, no hay cargo extra). Los minutos de Actions salen del plan de GitHub (con spending limit en $0 no hay factura sorpresa). Para usar una API key en lugar de la suscripción: cambiar en el yml `claude_code_oauth_token` por `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`.

### 1.2 Activarlo

- [ ] **Mergear el workflow a la rama por defecto.** No se puede probar en el PR que lo agrega: los eventos de comentarios siempre corren la versión del workflow de la rama por defecto (a propósito, para que nadie modifique el workflow en un PR y robe los secrets).
- [ ] Probarlo en cualquier PR abierto con un comentario `@claude revisá este PR`.

### 1.3 Cómo pedir la revisión

**Hilo general** (pestaña *Conversation*):

```
@claude revisá este PR completo contra las reglas del repo. Priorizá correctness
sobre estilo y ordená los hallazgos de más a menos grave.
```

```
@claude revisá solo los archivos de src/modules/pokemon de este PR.
```

```
@claude revisá este PR enfocándote en las reglas firmes (RTK directo en el componente,
react-hook-form + Yup, await en el handler con error inline). Ignorá lo visual.
```

**In-line** (pestaña *Files changed*, click en el `+` de la línea; Claude ya recibe archivo y línea):

```
@claude ¿este useEffect se puede evitar?
@claude esto usa builder.mutation para leer. ¿Debería ser builder.query?
@claude este componente pasa las 200 líneas. ¿Cómo lo dividirías?
```

### 1.4 Trampas conocidas

- Los comentarios dentro de un **review sin enviar** (*Start a review*) no disparan nada hasta **Submit review**.
- Los comentarios los firma **`github-actions[bot]`**, no `claude[bot]`: el workflow usa el `GITHUB_TOKEN` en vez de la GitHub App de Claude (sirve cuando la organización exige aprobar apps de terceros). Si instalás la app, se borra la línea `github_token:`.
- El idioma está forzado en el `--append-system-prompt` del yml: tu `~/.claude/CLAUDE.md` no viaja al runner.
- Las reglas de review **no** se editan en el yml: viven en `.github/instructions/code-review.instructions.md` (una sola fuente de verdad).

---

## 2. Dependabot (`dependabot.yml`)

### 2.1 Toggles en Settings → Advanced Security (todos gratis)

- [ ] **Dependency graph** (prerequisito de lo demás)
- [ ] **Dependabot alerts**
- [ ] **Dependabot security updates** (abre el PR con el parche cuando hay un CVE)
- [ ] **Grouped security updates** (junta los fixes en un PR; sin esto, un día malo abre varios PRs que se pisan en el lockfile)
- [ ] **Dependabot malware alerts**

**Version updates** no tiene toggle: se activa porque `dependabot.yml` está en la rama por defecto. Si aparece un botón "Enable" que abre un editor web, cancelarlo: el archivo ya viene en el repo.

> ⚠️ **NO activar** *Secret Protection* ni *Code Security*: son GitHub Advanced Security y **se cobran por committer activo** en repos privados. En repos públicos el *Secret scanning* es gratis (ver paso 3). No tienen relación con Dependabot.
>
> Tampoco hacen falta: *Dependabot on self-hosted runners*, *Prevent direct alert dismissals*, *Automatic dependency submission*.

### 2.2 Ajustes del archivo (antes del primer merge)

- [ ] `timezone` y `day` del grupo: hoy `America/Mexico_City`, martes 08:00. Si tenés varios repos, **escalonar el día** para no juntar todos los PRs.
- [ ] Mergear por PR (GitHub agrega un check de validación de sintaxis).
- [ ] Forzar la primera corrida sin esperar al día agendado: **Insights → Dependency graph → Dependabot → Check for updates**. La primera arrastra todo el atraso acumulado; el ritmo normal con versiones exactas es de pocos PRs al mes.

### 2.3 Quién ve las alertas y avisos

- [ ] **Settings → Advanced Security → Access to alerts:** sumar al menos a una segunda persona (las alertas son restringidas a propósito; no depender de una sola).
- [ ] **Notificaciones** (por cuenta, una vez): `https://github.com/settings/notifications` → *Dependabot alerts* → email + web. Evitar el *weekly digest* (un CVE crítico del miércoles te llega el domingo).

### 2.4 Cómo se trabaja cada semana

- Llega 1 PR de rutina (martes) y, aparte, un PR de seguridad solo si hay un CVE con parche.
- Completarlo en local con **`/deps-triage`**: dice qué alertas afectan de verdad, valida el PR y deja el reporte como comentario. Antes, completar los revisores en `.claude/skills/deps-triage/CONFIG.md`.
- Si coinciden los dos PRs: **primero el de seguridad**; el de rutina se rebasa solo.
- Lo que toque `react`, `@mui/*` o `@emotion/*` pide **validación visual** (`/qa-visual`): que el build pase no dice que la pantalla se vea bien.
- Si alguien commitea en el PR de Dependabot, deja de actualizarlo: mergearlo esa misma semana.
- Majors: nunca automáticos. Revisarlos a mano cada tanto (`pnpm outdated`); `/deps-triage` arma la ficha de cada uno.

---

## 3. Checks de seguridad (`audit.yml`, `lint-security.yml`)

No necesitan secrets: corren en cada PR con el `GITHUB_TOKEN` y, si fallan, comentan en el PR qué hacer. Solo hay que decidir que **bloqueen el merge** (paso 4).

- Excepciones de `audit`: `.audit-exceptions.json` (con motivo y fecha de vencimiento; al vencer, vuelve a bloquear).
- Excepciones de `lint-security`: `// eslint-disable-next-line <regla> -- motivo` en la línea.
- Secretos commiteados: si el repo es **público**, activar en Settings → Advanced Security → *Secret scanning* y *Push protection* (gratis en repos públicos; bloquea el push si detecta un token).
- Para correrlos en local: `pnpm audit:gate` y `pnpm lint:security`.

---

## 4. Proteger la rama por defecto

Settings → Branches (o Rulesets) → regla para la rama por defecto:

- [ ] Exigir PR antes de mergear (sin pushes directos).
- [ ] Exigir que pasen los checks: **`audit`** y **`lint-security`** (aparecen en la lista después de la primera corrida).
- [ ] *(Recomendado)* `CODEOWNERS` con `/.github/ @<tu-usuario>` + exigir review del code owner: evita que un PR borre `dependabot.yml` o afloje un workflow sin que te enteres. Apagar Dependabot no rompe nada: **falla en silencio**.

---

## 5. En local (para los skills)

- [ ] `gh auth login` — lo usan `/deps-triage` (alertas y PRs) y `/pr` (saber si el PR ya existe).
- [ ] Copiar `.env.example` a `.env`.
- [ ] Nada más: los skills y el agente viven en `.claude/` y Claude Code los toma solo al abrir el repo.

---

## 6. Publicar en GitHub Pages (`workflows/deploy-pages.yml`)

- [ ] Settings → Pages → Build and deployment → **Source: GitHub Actions**.
- [ ] Correr el workflow: push a `main` o Actions → *Publicar en GitHub Pages* → **Run workflow**. La URL sale en el resumen del run (`https://<usuario>.github.io/<repo>/`).
- [ ] *(Opcional)* API publicada: Settings → Secrets and variables → Actions → **Variables** → `VITE_API_URL` con la URL de la API (sin `/` al final). Es una variable, no un secret: termina dentro del bundle público de todas formas.
- Sin `VITE_API_URL`: el login demo y la Pokédex (PokeAPI) funcionan; Mi equipo, Dashboard, Torneos y Perfil muestran el error de conexión inline.
