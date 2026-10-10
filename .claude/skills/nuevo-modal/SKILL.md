---
name: nuevo-modal
description: Genera un modal nuevo (Dialog MUI + form con react-hook-form + Yup, o modal de solo confirmación) conectado a un slice de modales con enum y renderizado condicional, para que el form se monte limpio sin reset(). Agrega interface y schema al core/_models.ts del módulo. Usar cuando pidan "crear un modal", "un diálogo para crear/eliminar/confirmar X" o invoquen /nuevo-modal.
---

# nuevo-modal

Ejemplos: `PokemonModalCreate` + `PokemonCreateForm` (con form) y `PokemonModalDelete` (confirmación) en `src/modules/pokemon/pokemon-list/components/modal/`.

## Entrada

- Entidad y acción (`pokemon` + `create`).
- Campos del form: `nombre | tipo | required | label "…"` (tipos: text, number, email, password, select[a,b], boolean, textarea). Sin campos = modal de confirmación.
- Carpeta destino y `core/_models.ts` del módulo.
- Mutation que dispara (hook ya existente; si no existe, usar la skill `rtk-service` primero).

## Naming

- Carpeta `<entidad>-modal-<accion>/`.
- Dialog: `<Entidad>Modal<Accion>.tsx`, **default export**.
- Form: `<Entidad><Accion>Form.tsx`, named export.
- Interface `I<Entidad><Accion>Form` y schema `<entidad><Accion>Schema` en `core/_models.ts`.

## Reglas

1. **Slice de modales con enum** (`src/store/slice/<entidad>ModalSlice.ts`): `enum Index<Entidad>Modal { none, create, delete, … }` + el recurso seleccionado. Al abrir: `dispatch(setIndex<Entidad>Modal({ index, <recurso> }))`. Al cerrar: `index: none` (el reducer limpia el recurso). Si el slice no existe, crearlo y registrarlo en `store.ts`.
2. **Render condicional, no `open` toggleado**: el padre hace `{indexModal === IndexX.create && <XModalCreate />}` y el Dialog va con `open` fijo. Así el form se desmonta al cerrar y **no hace falta `reset()`**.
3. **El form vive un nivel abajo** (dentro del modal), con su propio `useForm({ resolver: yupResolver(schema), defaultValues })`.
4. Forms de 1-4 campos: `useForm` directo. 5+ campos o secciones: `FormProvider` + hijos con `useFormContext` (ver `form-edicion`).
5. Inputs con el `TextField` de MUI tal cual, con `fullWidth` (sin estilos propios). Selects/autocomplete/switch → `Controller`. Si algo hace `setValue` sobre un input de texto, usar `Controller` (con `register` el label no se entera y se encima).
6. **Handler**: `await` la mutation y, sin `unwrap()`, guard sobre el resultado:
   ```ts
   const result = await createX(values);
   if (!result.data) return;          // el error ya lo muestra el alert inline
   close();
   success("…", { title: "Título" }); // useStatusMessage(): éxito global (los errores nunca, van inline)
   ```
   Para mutations sin body de respuesta: `if (result.error) return;`.
7. **Error inline** dentro del modal, decidido por el padre: `{status.isError && <ErrorAlert text={getRTKErrorMessage(status.error)} close={status.reset} />}`. Nunca el mismo error también en el mensaje global.
8. Botón submit con `loading={status.isLoading}`, nunca `disabled` por validez del form.
9. Modal de confirmación (sin inputs): contenido inline en el Dialog, sin archivo Form.
10. Excepción válida: un modal **muy local y de solo lectura** puede abrirse con `useState` en el padre (ver `PokedexDetailModal`).

## Salida

Archivos creados, cambios al slice/`store.ts`/`_models.ts`, y dónde montar el modal en el padre. Verificar con `pnpm build` y abriendo/cerrando el modal dos veces (debe reabrir limpio).
