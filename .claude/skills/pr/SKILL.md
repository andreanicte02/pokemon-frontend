---
name: pr
description: Escribe el título y la descripción de un Pull Request a partir de la rama actual, con la estructura definida en este skill. Entrega el texto listo para copiar; no crea el PR ni hace push salvo que se lo pidan. Usar cuando pidan "dame el PR", "armá la descripción del PR" o "texto para el PR".
allowed-tools:
  - "Read"
  - "Grep"
  - "Glob"
  - "Bash(git status)"
  - "Bash(git branch --show-current)"
  - "Bash(git fetch origin)"
  - "Bash(git log:*)"
  - "Bash(git diff:*)"
  - "Bash(git remote get-url origin)"
  - "Bash(gh pr view:*)"
---

# pr

Escribe el **título y la descripción** de un PR con la estructura de abajo (el repo no usa plantilla de PR). Quien abre el PR es la persona.

## Proceso

1. **Ubicarse**: `git status`, `git branch --show-current` (si es la rama base, parar), `git fetch origin`. Avisar sin frenar si hay cambios sin commitear o la rama está atrás. `gh pr view` para saber si ya hay PR abierto (entonces el texto es para actualizarlo).
2. **Leer el cambio completo**: `git log --oneline origin/<base>..HEAD`, `git diff --stat` y `git diff origin/<base>...HEAD` (por carpeta si es grande). La descripción sale **del diff**, no de los mensajes de commit.
3. **Título**: conventional commits en español, `tipo(scope): qué cambia` (`feat`, `fix`, `refactor`, `chore`, `docs`), sin punto final, ~72 caracteres máx.
4. **Descripción**: estas secciones, en este orden:
   - **Descripción**: qué problema resuelve y por qué, en 2-3 frases, en términos de qué cambia para quien usa la app.
   - **Cambios realizados**: lista corta agrupada por módulo, con el motivo; no un listado de archivos.
   - **Tipo de cambio**: solo el que corresponde, marcado: `Bugfix`, `Feature`, `Refactor` o `Chore` (dependencias, configuración, docs).
   - **¿Cómo se probó?**: solo lo que de verdad se corrió (comandos, pantallas, usuarios/permisos, casos borde). Si falta probar algo, decirlo.
   - **Lista de verificación**: `[x]` solo con evidencia; lo no comprobado queda `[ ]`; quitar lo que no aplica:
     - `pnpm build` (eslint + tsc + vite) y `pnpm lint:security` pasan
     - Probado en el navegador (y en mobile si toca UI)
     - Si cambia rutas o permisos, revisado con cada usuario afectado
     - Si cambia `package.json`, `pnpm-lock.yaml` viene en el mismo PR (versiones exactas)
     - Revisado con `/revisar-practicas`
   - **Notas** (opcional, al final): lo que el revisor debe saber.
5. **Avisos** (en Notas cuando apliquen): cambios de rutas o permisos (qué usuarios se revisaron), variable `VITE_*` nueva, dependencia con `^`/`~`, `package.json` sin `pnpm-lock.yaml` (o al revés).
6. **Entregar** en el chat: link de compare (`https://github.com/<owner>/<repo>/compare/<base>...<rama>?expand=1`) o el del PR abierto, el título en un bloque de código, la descripción en un bloque de cuatro backticks, y los avisos que no van en el PR.

## Nunca

- Crear el PR, hacer push o editar un PR sin que lo pidan.
- Inventar pruebas, tickets o resultados de CI, ni marcar casillas sin evidencia.
- Agregar líneas de firma.
