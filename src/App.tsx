import { useMemo, useState } from "react";

/* ---------- Tipos ---------- */
type Item = { id: number; texto: string; tip?: string };

/* ---------- Checklist (Guía rápida) ---------- */
const items: Item[] = [
  {
    id: 1,
    texto: "Constancia REPSE vigente con número de registro y actividad(es).",
    tip: "La actividad debe estar explícitamente descrita en la constancia.",
  },
  {
    id: 2,
    texto:
      "La actividad registrada coincide con el servicio contratado y NO es actividad preponderante del cliente.",
    tip: "Contrato de especialización real: objeto claro y no-core.",
  },
  {
    id: 3,
    texto: "Contrato especializado con cláusulas REPSE y calendario de entregables.",
    tip: "Incluye auditoría, rescisión por incumplimiento y responsabilidades.",
  },
  {
    id: 4,
    texto: "Opinión de cumplimiento SAT en positivo y al día.",
    tip: "Sin créditos fiscales ni inconsistencias vigentes.",
  },
  {
    id: 5,
    texto:
      "Acuses cuatrimestrales ICSOE (IMSS) / SISUB (INFONAVIT), cuando aplique.",
    tip: "Revisa que correspondan al periodo del servicio.",
  },
  {
    id: 6,
    texto:
      "CFDI de nómina del personal asignado + comprobantes de pago IMSS/INFONAVIT/ISR.",
    tip: "Asegura correlación nómina–personal–periodo facturado.",
  },
  {
    id: 7,
    texto:
      "Listado nominal de personal vigente por contrato (altas/bajas) y evidencias de inducción/EPP/accesos.",
    tip: "Verifica que quienes entran a sitio están en nómina y con EPP.",
  },
  {
    id: 8,
    texto:
      "Evidencias operativas y de SSOMA cuando aplique (bitácoras, permisos, pólizas de RC/RT).",
    tip: "Particularmente en mantenimiento, obra o trabajos de riesgo.",
  },
  {
    id: 9,
    texto:
      "Prohibición de subcontratación en cascada sin autorización y misma trazabilidad documental.",
    tip: "Evita cadenas opacas que incrementan el riesgo fiscal/laboral.",
  },
  {
    id: 10,
    texto:
      "Gobierno documental: paquete previo a cada pago y revisión trimestral/validación anual.",
    tip: "Sin documentos → sin pago. Programa auditorías express.",
  },
];

/* ---------- Semáforo ---------- */
function semaforo(totalOk: number, total: number) {
  const pct = (totalOk / total) * 100;
  if (pct >= 80) {
    return {
      badge: "Apto",
      tono: "text-emerald-700",
      bg: "bg-emerald-50",
      msg:
        "Expediente y trazabilidad adecuados. Mantén revisión mensual y auditoría trimestral.",
    };
  }
  if (pct >= 50) {
    return {
      badge: "Condicionado",
      tono: "text-amber-700",
      bg: "bg-amber-50",
      msg:
        "Faltan soportes clave. Solicita el paquete faltante y define fecha de cierre antes de liberar pagos.",
    };
  }
  return {
    badge: "No apto",
    tono: "text-red-700",
    bg: "bg-red-50",
    msg:
      "Riesgo alto de no deducibilidad/no acreditamiento y contingencias. Detén altas/pagos y corrige de inmediato.",
  };
}

export default function App() {
  const [checks, setChecks] = useState<Record<number, boolean>>({});

  const totalOk = useMemo(
    () => items.reduce((acc, it) => acc + (checks[it.id] ? 1 : 0), 0),
    [checks]
  );
  const data = semaforo(totalOk, items.length);

  const toggle = (id: number) =>
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));

  const reiniciar = () => setChecks({});

  const imprimir = () => window.print();

  return (
    <>
      {/* Fondo gris oscuro + velo de lectura */}
      <div className="fixed inset-0 -z-10 bg-neutral-900" aria-hidden="true" />
      <div
        className="fixed inset-0 -z-10 bg-white/75 backdrop-blur-[0px]"
        aria-hidden="true"
      />

      <main className="mx-auto max-w-3xl p-6">
        {/* Header */}
        <header className="mb-6 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/quokka-logo.png"
                alt="Guía REPSE"
                className="h-10 sm:h-12"
              />
              <div className="hidden sm:block text-sm text-neutral-600">
                Guía rápida de validación
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={reiniciar}
                className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50"
              >
                Reiniciar
              </button>
              <button
                onClick={imprimir}
                className="rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90"
              >
                Imprimir / PDF
              </button>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Guía rápida para validar el REPSE de tu proveedor
          </h1>
          <p className="text-sm text-neutral-600">
            Marca cada punto que tu proveedor cumpla. Usa el semáforo como
            referencia para contratar, condicionar o detener pagos.
          </p>
        </header>

        {/* Estado superior */}
        <div className="mb-3 text-sm text-neutral-600 print:hidden">
          Cumplidos:{" "}
          <span className="font-semibold">
            {totalOk} / {items.length}
          </span>
        </div>

        {/* Panel resultado */}
        <section className={`mb-5 rounded-2xl p-5 ${data.bg}`}>
          <p className="text-sm font-semibold tracking-wide">RESULTADO:</p>
          <p className="mt-1">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${data.tono}`}
            >
              {data.badge}
            </span>
            <span className="ml-2 text-xs text-neutral-600">
              | Total: {totalOk} / {items.length}
            </span>
          </p>
          <p className={`mt-2 ${data.tono}`}>{data.msg}</p>
        </section>

        {/* Checklist */}
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border bg-white/90 p-4 shadow">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!checks[it.id]}
                  onChange={() => toggle(it.id)}
                  className="mt-1 h-5 w-5"
                />
                <div>
                  <p className="font-medium">
                    {it.id}. {it.texto}
                  </p>
                  {it.tip && (
                    <p className="mt-1 text-sm text-neutral-600">{it.tip}</p>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>

        {/* Red flags / Notas */}
        <section className="mt-6 rounded-2xl border bg-white/90 p-4 shadow">
          <h2 className="font-semibold">Red flags frecuentes</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
            <li>Registro REPSE vencido o actividad que no embona con el servicio.</li>
            <li>Negativa a entregar SAT/ICSOE/SISUB/CFDI de nómina y soportes.</li>
            <li>Cambios de razón social recurrentes o precios “demasiado bajos”.</li>
            <li>Personal en sitio que no aparece en nómina o sin EPP/inducción.</li>
            <li>Subcontratación en cascada sin autorización ni trazabilidad.</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} — Guía rápida REPSE • Uso interno de
          Compras/Finanzas.
        </footer>
      </main>
    </>
  );
}
