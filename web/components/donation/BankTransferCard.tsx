import { Check, ChevronDown, Clock3, Landmark } from "lucide-react";

type BankTransferCardProps = {
  accountHolder?: string;
  iban?: string;
  bic?: string;
};

function isValidIban(value: string) {
  const compact = value.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(compact)) return false;

  const rearranged = `${compact.slice(4)}${compact.slice(0, 4)}`;
  const digits = [...rearranged].map((character) => {
    const code = character.charCodeAt(0);
    return code >= 65 && code <= 90 ? String(code - 55) : character;
  }).join("");

  let remainder = 0;
  for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}

function formatIban(iban: string) {
  return iban.replace(/\s+/g, "").toUpperCase().match(/.{1,4}/g)?.join(" ") ?? iban;
}

export function BankTransferCard({ accountHolder, iban, bic }: BankTransferCardProps) {
  const safeAccountHolder = accountHolder?.trim() ?? "";
  const normalizedIban = iban?.replace(/\s+/g, "").toUpperCase() ?? "";
  const ready = Boolean(safeAccountHolder && normalizedIban && isValidIban(normalizedIban));

  return (
    <article className={`glass-panel flex h-full flex-col rounded-2xl border p-5 shadow-sm transition duration-200 sm:p-6 ${ready ? "border-primary/30 shadow-primary/5" : "border-base-content/15"}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ready ? "bg-primary text-primary-content" : "bg-base-content/10 text-base-content/80"}`}>
          <Landmark className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-xl font-semibold text-base-content sm:text-2xl">Transferencia bancaria</h3>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ready ? "bg-success/20 text-status-success" : "bg-base-content/10 text-base-content/80"}`}>
              {ready ? <Check className="h-3 w-3" aria-hidden="true" /> : <Clock3 className="h-3 w-3" aria-hidden="true" />}
              {ready ? "Disponible" : "Próximamente"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-base-content/80">
            {ready ? "Consulta los datos de la cuenta de la iglesia para realizar tu aportación desde tu banco." : "Esta opción estará disponible cuando confirmemos los datos oficiales de la cuenta."}
          </p>
        </div>
      </div>

      {ready ? (
        <details className="group mt-5 rounded-xl border border-primary/20 bg-base-100/80 open:bg-base-100/90">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
            <span>Ver datos para transferencia</span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <dl className="grid gap-3 border-t border-base-content/10 px-4 py-4 text-sm">
            <div>
              <dt className="text-xs font-medium text-base-content/80">Titular de la cuenta</dt>
              <dd className="mt-1 break-words font-semibold text-base-content">{safeAccountHolder}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-base-content/80">IBAN</dt>
              <dd className="mt-1 break-all font-mono font-semibold tracking-wide text-base-content">{formatIban(normalizedIban)}</dd>
            </div>
            {bic?.trim() ? (
              <div>
                <dt className="text-xs font-medium text-base-content/80">BIC / SWIFT</dt>
                <dd className="mt-1 font-mono font-semibold tracking-wide text-base-content">{bic.trim().toUpperCase()}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-medium text-base-content/80">Concepto recomendado</dt>
              <dd className="mt-1 font-medium text-base-content">Donación CCI Sabadell</dd>
            </div>
          </dl>
        </details>
      ) : null}
    </article>
  );
}
