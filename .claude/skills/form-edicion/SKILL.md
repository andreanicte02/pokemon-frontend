---
name: form-edicion
description: Construye o migra una pantalla/form de edición al estándar de 4 capas - guard isDirty + aviso "No hay cambios por guardar" con botón siempre habilitado, quedarse en la pantalla con éxito inline que se cierra solo, detalle por query + tags para volver a pristine sin reset(), y filtros del listado que sobreviven. Incluye forms grandes con FormProvider + secciones + yup.when. Usar cuando pidan "pantalla de edición", "editar X", "form de perfil/configuración" o invoquen /form-edicion.
---

# form-edicion

Ejemplos: `src/modules/pokemon/pokemon-edit/` (form chico) y `src/modules/profile/profile-edit/` (form grande por secciones).

## Las 4 capas

| | Capa | Cómo |
|---|---|---|
| **A** | No enviar sin cambios | `if (!formState.isDirty \|\| isFetching) return;` al inicio del handler + aviso "No hay cambios por guardar" + botón **siempre habilitado** |
| **B** | Quedarse en la pantalla | Éxito **inline** con `StatusMessage` (se cierra solo, sin X), sin navegar; botón "Regresar" al pie |
| **C** | Volver a pristine solo | Detalle por `builder.query` + `providesTags: ["<X>Detail"]`; la edición `invalidatesTags: ["<X>Detail"]`; `useForm({ values })` |
| **D** | No perder el filtro del listado | Ver skill `listado-con-filtros` |

## Reglas

1. **Detalle**: `useXDetailQuery(id, { refetchOnMountOrArgChange: true, skip: !id })`. Renderizar el form solo cuando hay `data`.
2. **`values`, no `defaultValues`**: cuando la query refetchea tras guardar, RHF re-sincroniza la baseline y `isDirty` vuelve a `false` sin `reset()`. `values` exige el tipo completo (`campo ?? ""`).
3. **Handler**:
   ```ts
   const onSubmit = async (values: IXForm) => {
      if (!formState.isDirty || isFetching) return;
      await editX({ id, ...values });
      // éxito y error los pintan los alerts inline leyendo editXStatus
   };
   ```
4. **Feedback inline**, una sola fuente:
   ```tsx
   {status.isSuccess && <StatusMessage title="…" description="…" close={status.reset} />}
   {status.isError && <ErrorAlert text={getRTKErrorMessage(status.error)} close={status.reset} />}
   ```
   Éxito se cierra solo (5 s + X); el error **no** se cierra solo.
5. **Aviso + botón**, pegados y dentro de **la misma condición de visibilidad** (si el usuario no puede editar, no se ve ninguno de los dos):
   ```tsx
   {!formState.isDirty && <Box component="span" sx={{ color: "text.secondary" }}>No hay cambios por guardar</Box>}
   <Button type="submit" variant="contained" loading={status.isLoading || isFetching}>Guardar</Button>
   ```
   **Nunca** `disabled={!isDirty}`: un botón gris no explica nada. `loading` sí (bloquea mientras viaja la petición).
6. **`setValue` sobre algo que el usuario edita** (avatar, archivo, selección por click) → `{ shouldDirty: true }`, o el guard bloquea el guardado. `setValue` de sincronización interna (en un `useEffect`) **sin** `shouldDirty`.
7. **Excepción a la capa C**: si el detalle no devuelve algún campo del form (queda fijo en `""`), refetchear lo borraría de la pantalla → no invalidar y hacer `reset(values)` tras el éxito.

## Forms grandes (5+ campos o 2+ secciones)

- Un `<X>EditFormProvider` con `useForm({ resolver: yupResolver(schemaCompleto), values })` y `<FormProvider>`.
- Una sección por archivo en `sections/`, cada una con `useFormContext<IXForm>()` y solo sus campos.
- Un `<X>EditFormSections` con el `<form>`, el handler y el feedback.
- Condicionales con `yup.when("campo", { is, then, otherwise })` en el schema, y la **misma** condición en el render de la sección (`useWatch`).
- Condición que depende de algo externo al form (rol, estado de Redux) → `context` en `useForm` y `yup.when([], { is: (_v, _p, { context }) => … })`.
- Sin permiso de edición: `<Box component="fieldset" disabled>` + aviso de solo lectura, y sin botón ni aviso de cambios.

## Verificación (con la pestaña Network abierta)

- Guardar sin tocar nada → **cero** peticiones.
- Guardar con cambios → **dos** (edición + refetch del detalle), aparece el éxito y vuelve "No hay cambios por guardar".
- Cambiar solo el campo seteado por `setValue` → se puede guardar.
