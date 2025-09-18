import React, { useMemo, useState } from "react";

/* ---------- Modelo ---------- */
type Item = { id: number; titulo: string; detalle: string; url?: string };

const items: Item[] = [
  {
    id: 1,
    titulo: "Constancia REPSE vigente con número de registro y actividad(es).",
    detalle:
      "La(s) actividad(es) debe(n) estar explícitamente descritas en la constancia.",
  },
  {
    id: 2,
    titulo:
      "La actividad registrada coincide con el servicio contratado y NO es actividad preponderante del cliente.",
    detalle:
      "Contrato de especialización real: objeto claro y no-core para tu operación.",
  },
  {
    id: 3,
    titulo:
      "Contrato especializado con cláusulas REPSE y calendario de entregables.",
    detalle: "Incluye auditoría, rescisión por incumplimiento y responsabilidades.",
  },
  {
    id: 4,
    titulo: "Opinión de cumplimiento SAT en positivo y al día.",
    detalle:
      "Verifica que no tenga créditos fiscales vencidos; guarda evidencia (PDF).",
  },
  {
    id: 5,
    titulo: "IMSS / INFONAVIT al corriente (comprobable).",
    detalle:
      "Recibe mensualmente línea de captura/pagos y relación de asegurados.",
  },
  {
    id: 6,
    titulo:
      "Recibes nóminas timbradas y listado de personal asignado (con NSS y puesto).",
    detalle:
      "Debe existir trazabilidad: quién presta el servicio y bajo qué condiciones.",
  },
  {
    id: 7,
    titulo:
      "Entregan evidencia mensual de cumplimiento (SAT, IMSS, INFONAVIT, nómina) como parte del servicio.",
    detalle:
      "Incluye en contrato el paquete de evidencias y su calendario de entrega.",
  },
  {
    id: 8,
    titulo:
      "El padrón/consulta pública de STPS muestra estatus VIGENTE y sin notas de suspensión/cancelación.",
    detalle:
      "Valida en el portal oficial de STPS y conserva capturas/acuse de consulta.",
    url: "https://repse.stps.gob.mx/",
  },
  {
    id: 9,
    titulo:
      "Las facturas y CFDI’s describen el servicio especializado y refieren el contrato REPSE.",
    detalle:
      "Evita descripciones genéricas; vincula a contrato/orden de servicio y REPSE.",
  },
  {
    id: 10,
    titulo:
      "Tu área legal/finanzas realiza auditorías y checklists REPSE periódicos (trazabilidad).",
    detalle:
      "Hay responsable, calendario y bitácora de auditoría con hallazgos y cierres.",
  },
];

/* ---------- Rangos ---------- */
type Rango = {
  badge: "No apto" | "Condicionado" | "Apto";
  tono: string; // texto
  bg: string; // fondo
  heading: string;
  detail: string;
};

function rango(score: number, total: number): Rango {
  const pct = (score / total) * 100;
  if (pct < 60)
    return {
      badge: "No apto",
      tono: "text-red-700",
      bg: "bg-red-50",
      heading: "Riesgo alto. Detén altas/pagos y corrige de inmediato.",
      detail:
        "Riesgo de no deducibilidad/no acreditamiento y contingencias laborales/fiscales. Exige correcciones antes de contratar o continuar.",
    };
  if (pct < 90)
    return {
      badge: "Condicionado",
      tono: "text-amber-700",
      bg: "bg-amber-50",
      heading:
        "Avance parcial. Contrata o paga solo contra plan de cierre con fechas.",
      detail:
        "Asegura evidencias mensuales (SAT/IMSS/INFONAVIT/nómina), contrato con cláusulas REPSE y trazabilidad. Documenta todo.",
    };
  return {
    badge: "Apto",
    tono: "text-emerald-700",
    bg: "bg-emerald-50",
    heading: "Proveedor con cumplimiento sólido.",
    detail:
      "Mantén auditorías periódicas y el paquete de evidencias para conservar deducibilidad y minimizar riesgos.",
  };
}

/* ---------- Modal ---------- */
function Modal({
  open,
  onClose,
  children,
  title = "Resultado de la validación",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {children}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-100 px-3 py-2 hover:bg-neutral-200"
          >
            Cerrar
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-black px-3 py-2 text-white hover:opacity-90"
          >
            Imprimir / PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [check, setCheck] = useState<Record<number, boolean>>({});
  const [openModal, setOpenModal] = useState(false);

  const total = items.length;

  const cumplidos = useMemo(
    () => items.reduce((acc, it) => acc + (check[it.id] ? 1 : 0), 0),
    [check]
  );

  const data = rango(cumplidos, total);

  const toggle = (id: number) =>
    setCheck((prev) => ({ ...prev, [id]: !prev[id] }));

  const reiniciar = () => {
    setCheck({});
    setOpenModal(false);
  };

  const exportarCSV = () => {
    const encabezados = ["Punto", "Cumple (1/0)", "Notas"];
    const filas = items.map((i) => [
      `${i.id}. ${i.titulo}`.replace(/;/g, ","),
      check[i.id] ? "1" : "0",
      "",
    ]);
    const csv = [encabezados, ...filas].map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guia_validacion_REPSE.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Abrir automáticamente cuando completes los 10 puntos
  React.useEffect(() => {
    if (cumplidos === total && total > 0) setOpenModal(true);
  }, [cumplidos, total]);

  return (
    <>
      {/* Fondo gris oscuro definido en index.css */}
      <main className="mx-auto max-w-3xl p-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/quokka-logo.png" alt="Quokka Group" className="h-10" />
            <div className="text-white/90">
              <p className="text-xs uppercase tracking-widest">
                Guía rápida de validación
              </p>
              <h1 className="text-2xl font-bold">
                Guía rápida para validar el REPSE de tu proveedor
              </h1>
            </div>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              onClick={reiniciar}
              className="rounded-xl bg-white/90 px-3 py-2 shadow hover:bg-white"
            >
              Reiniciar
            </button>
            <button
              onClick={exportarCSV}
              className="rounded-xl bg-white/90 px-3 py-2 shadow hover:bg-white"
            >
              Exportar CSV
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90"
            >
              Ver resultado
            </button>
          </div>
        </header>

        {/* Estado superior */}
        <div className="mb-3 text-sm text-white/80">
          Cumplidos: <span className="font-semibold">{cumplidos}</span> / {total}
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl bg-white/95 p-4 shadow">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5"
                  checked={!!check[it.id]}
                  onChange={() => toggle(it.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">
                    {it.id}. {it.titulo}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">{it.detalle}</p>
                  {it.url && (
                    <a
                      href={it.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-medium text-black underline underline-offset-4"
                    >
                      Abrir portal STPS
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones móviles */}
        <div className="mt-6 flex gap-2 sm:hidden">
          <button
            onClick={reiniciar}
            className="flex-1 rounded-xl bg-white/90 px-3 py-2 shadow hover:bg-white"
          >
            Reiniciar
          </button>
          <button
            onClick={exportarCSV}
            className="flex-1 rounded-xl bg-white/90 px-3 py-2 shadow hover:bg-white"
          >
            Exportar CSV
          </button>
          <button
            onClick={() => setOpenModal(true)}
            className="flex-1 rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90"
          >
            Ver resultado
          </button>
        </div>

        <footer className="mt-8 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Quokka Group · Material informativo, no
          constituye asesoría legal o fiscal.
        </footer>
      </main>

      {/* Modal de resultado */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Resultado del diagnóstico">
        <div className={`rounded-2xl p-4 ${data.bg}`}>
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${data.tono}`}
            >
              {data.badge}
            </span>
            <span className="text-neutral-600">| Total: {cumplidos} / {total}</span>
          </div>
          <p className={`mb-2 font-semibold ${data.tono}`}>{data.heading}</p>
          <p className="text-sm text-neutral-800">{data.detail}</p>
        </div>
      </Modal>
    </>
  );
}

