// Gate de seguridad de dependencias. Lo corre el check `audit` en cada PR (y se puede correr en local).
//
// Falla (exit 1) si `pnpm audit` reporta un advisory high o critical en
// dependencias de producción que no esté en `.audit-exceptions.json`, o cuya
// excepción ya venció. Solo lee el lockfile: no instala ni ejecuta nada.
//
// Excepciones: `.audit-exceptions.json` en la raíz, un arreglo de
//   { "id": "GHSA-…", "paquete": "…", "motivo": "…", "vence": "AAAA-MM-DD" }
// Van por advisory, no por paquete: un advisory nuevo del mismo paquete bloquea.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';

const ARCHIVO_EXCEPCIONES = '.audit-exceptions.json';
const SEVERIDADES_QUE_BLOQUEAN = ['high', 'critical'];

const salir = (mensaje) => {
   process.stderr.write(`\n✖ audit-gate: ${mensaje}\n`);
   process.exit(1);
};

const leerExcepciones = () => {
   if (!existsSync(ARCHIVO_EXCEPCIONES)) return [];
   let excepciones;
   try {
      excepciones = JSON.parse(readFileSync(ARCHIVO_EXCEPCIONES, 'utf8'));
   } catch (error) {
      salir(`${ARCHIVO_EXCEPCIONES} no es JSON válido (${error.message}).`);
   }
   if (!Array.isArray(excepciones)) salir(`${ARCHIVO_EXCEPCIONES} debe ser un arreglo.`);
   for (const excepcion of excepciones) {
      const completa = excepcion.id && excepcion.motivo && /^\d{4}-\d{2}-\d{2}$/.test(excepcion.vence ?? '');
      if (!completa) {
         salir(`excepción incompleta en ${ARCHIVO_EXCEPCIONES}: cada una lleva "id", "motivo" y "vence" (AAAA-MM-DD).`);
      }
   }
   return excepciones;
};

const correrAudit = () => {
   // pnpm audit sale con 1 cuando encuentra algo: el resultado se lee del JSON, no del exit code.
   const { stdout, error } = spawnSync(
      'pnpm',
      ['audit', '--json', '--prod'],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: process.platform === 'win32' },
   );
   if (error) salir(`no se pudo ejecutar pnpm audit (${error.message}).`);
   let reporte;
   try {
      reporte = JSON.parse(stdout);
   } catch {
      salir('pnpm audit no devolvió JSON. Sin respuesta del registry no se puede validar: el gate bloquea.');
   }
   // Sin `advisories` la respuesta es un error del registry (o falta el lockfile), no "todo limpio".
   if (reporte.error || !reporte.advisories) {
      salir(`pnpm audit falló: ${reporte.error?.message || reporte.message || 'respuesta inesperada'}.`);
   }
   return reporte;
};

// pnpm devuelve un objeto `advisories` (un advisory por entrada, ya sin los paquetes que
// solo lo contagian). El id es el GHSA, el mismo que se usa en `.audit-exceptions.json`.
const advisoriesQueBloquean = (reporte) =>
   Object.values(reporte.advisories)
      .filter((advisory) => SEVERIDADES_QUE_BLOQUEAN.includes(advisory.severity))
      .map((advisory) => ({
         id: advisory.github_advisory_id ?? advisory.url?.split('/').pop() ?? String(advisory.id),
         paquete: advisory.module_name,
         severidad: advisory.severity,
         titulo: advisory.title,
         url: advisory.url,
      }));

const hoy = new Date().toISOString().slice(0, 10);
const excepciones = leerExcepciones();
const advisories = advisoriesQueBloquean(correrAudit());

const vigentes = new Map(excepciones.filter((excepcion) => excepcion.vence >= hoy).map((e) => [e.id, e]));
const vencidas = new Map(excepciones.filter((excepcion) => excepcion.vence < hoy).map((e) => [e.id, e]));

const exceptuados = advisories.filter((advisory) => vigentes.has(advisory.id));
const bloqueantes = advisories.filter((advisory) => !vigentes.has(advisory.id));
const sinUso = excepciones.filter((excepcion) => !advisories.some((advisory) => advisory.id === excepcion.id));

const linea = (advisory) => `  ${advisory.severidad.padEnd(8)} ${advisory.paquete} — ${advisory.titulo}\n           ${advisory.url}`;

if (exceptuados.length > 0) {
   process.stdout.write(`\nExceptuados (${exceptuados.length}):\n`);
   for (const advisory of exceptuados) {
      const { vence, motivo } = vigentes.get(advisory.id);
      process.stdout.write(`${linea(advisory)}\n           vence ${vence} · ${motivo}\n`);
   }
}

if (sinUso.length > 0) {
   process.stdout.write(`\nExcepciones que ya no hacen falta (se pueden borrar de ${ARCHIVO_EXCEPCIONES}):\n`);
   for (const excepcion of sinUso) process.stdout.write(`  ${excepcion.id} ${excepcion.paquete ?? ''}\n`);
}

if (bloqueantes.length > 0) {
   process.stderr.write(`\n✖ audit-gate: ${bloqueantes.length} advisory high/critical en dependencias de producción:\n`);
   for (const advisory of bloqueantes) {
      const vencida = vencidas.get(advisory.id);
      process.stderr.write(`${linea(advisory)}\n${vencida ? `           la excepción venció el ${vencida.vence}\n` : ''}`);
   }
   process.stderr.write(`\nSubir la dependencia o, si no hay fix, agregar una excepción con vencimiento en ${ARCHIVO_EXCEPCIONES}.\n`);
   process.exit(1);
}

process.stdout.write('\n✔ audit-gate: sin advisories high/critical pendientes en dependencias de producción.\n');
