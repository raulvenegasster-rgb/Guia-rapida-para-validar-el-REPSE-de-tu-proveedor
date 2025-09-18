import React from "react";

/* ---------- Modelo ---------- */
type Item = { id: number; titulo: string; detalle: string; url?: string };

// 10 puntos de la guía
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

type Rango = {
  badge: "No apto" | "Condicionado" | "Apto";
  tono: string;
  bg: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
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
  // 1 = Sí, 0 = No, undefined = sin contestar
  const [resp, setResp] = React.useState<Record<number, 1 | 0 | undefined>>({});
  const [openModal, setOpenModal] = React.useState(false);

  const total = items.length;

  const respondidas = React.useMemo(
    () => items.reduce((a, i) => a + (resp[i.id] !== undefined ? 1 : 0), 0),
    [resp]
  );
  const puntos = React.useMemo(
    () => items.reduce((a, i) => a + (resp[i.id] === 1 ? 1 : 0), 0),
    [resp]
  );

  const data = rango(puntos, total);

  const setValor = (id: number, val: 1 | 0) =>
    setResp((prev) => ({ ...prev, [id]: val }));

  const reiniciar = () => {
    setResp({});
    setOpenModal(false);
  };

  const exportarCSV = () => {
    const encabezados = ["Punto", "Respuesta (1=Sí,0=No)"];
    const filas = items.map((i) => [
      `${i.id}. ${i.titulo}`.replace(/;/g, ","),
      resp[i.id] ?? "",
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

  // Abrir modal al terminar de responder TODAS
  React.useEffect(() => {
    if (respondidas === total && total > 0) {
      setOpenModal(true);
    }
  }, [respondidas, total]);

  return (
    <>
      {/* Fondo gris más claro */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-b from-neutral-800 to-neutral-700"
        aria-hidden="true"
      />

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

        {/* Estado */}
        <div className="mb-3 text-sm text-white/80">
          Contestadas: <span className="font-semibold">{respondidas}</span> / {total}
        </div>

        {/* Preguntas */}
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl bg-white/95 p-4 shadow">
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
              <div className="mt-3 flex gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q_${it.id}`}
                    className="h-4 w-4"
                    checked={resp[it.id] === 1}
                    onChange={() => setValor(it.id, 1)}
                  />
                  <span>Sí</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q_${it.id}`}
                    className="h-4 w-4"
                    checked={resp[it.id] === 0}
                    onChange={() => setValor(it.id, 0)}
                  />
                  <span>No</span>
                </label>
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

      {/* Modal resultado */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Resultado del diagnóstico"
      >
        <div className={`rounded-2xl p-4 ${data.bg}`}>
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${data.tono}`}
            >
              {data.badge}
            </span>
            <span className="text-neutral-600">
              | Total: {puntos} / {total}
            </span>
          </div>
          <p className={`mb-2 font-semibold ${data.tono}`}>{data.heading}</p>
          <p className="text-sm text-neutral-800">{data.detail}</p>
        </div>
      </Modal>
    </>
  );
}


