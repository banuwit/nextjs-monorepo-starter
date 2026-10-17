import {
  calculateInvoice,
  formatInvoiceCurrency,
  getLineAmount,
  invoiceTaxOptions,
  type Invoice,
} from "../invoice-model";

export function InvoicePaper({ invoice }: { invoice: Invoice }) {
  const taxOption = invoiceTaxOptions.find(
    (option) => option.id === invoice.taxId,
  )!;
  const totals = calculateInvoice(invoice);
  const discountValue = Number.isFinite(invoice.discountValue)
    ? invoice.discountValue
    : 0;
  const discountLabel =
    invoice.discountType === "percent"
      ? `Discount ${discountValue}%`
      : "Discount";

  return (
    <article
      style={{ width: 816, minHeight: 1056 }}
      data-invoice-paper
      className="relative flex flex-col gap-24 wrap-anywhere bg-neutral-50 px-12.25 py-11 font-sans text-neutral-950"
    >
      <header className="flex flex-col gap-10">
        <div className="grid grid-cols-2 items-start gap-14">
          <svg className="size-12" viewBox="0 0 48 48" aria-hidden="true">
            <rect width="20" height="20" rx="3" fill="currentColor" />
            <rect x="28" width="20" height="20" rx="3" fill="currentColor" />
            <rect y="28" width="20" height="20" rx="3" fill="currentColor" />
            <rect
              x="28"
              y="28"
              width="20"
              height="20"
              rx="3"
              fill="currentColor"
            />
          </svg>
          <h2 className="text-4xl uppercase tracking-widest">Invoice</h2>
        </div>

        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p>Reference: {invoice.referenceNumber}</p>
            <p>Issued: {invoice.issuedDate}</p>
            <p>Payment due: {invoice.paymentDueDate}</p>
          </div>
          <div>
            <p>Payment account</p>
            <p>{invoice.from.paymentAccountName}</p>
            <p>Routing no. {invoice.from.routingNumber}</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <div>
            <p className="mb-4 font-semibold uppercase">From</p>
            <p>{invoice.from.name}</p>
            {invoice.from.addressLines.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
            <p>Tax ID: {invoice.from.taxId}</p>
          </div>
          <div>
            <p className="mb-4 font-semibold uppercase">Bill to</p>
            <p>{invoice.to.name}</p>
            {invoice.to.addressLines.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
            <p>Tax ID: {invoice.to.taxId}</p>
          </div>
        </section>
      </header>

      <div className="flex flex-col gap-5">
        <section className="text-sm">
          <div className="grid grid-cols-[1fr_74px_116px_116px] bg-stone-200 px-3 py-3 font-semibold uppercase">
            <span>Description</span>
            <span className="text-right">Units</span>
            <span className="text-right">Unit cost</span>
            <span className="text-right">Line total</span>
          </div>
          {invoice.items.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid grid grid-cols-[minmax(0,1fr)_74px_116px_116px] border-[oklch(0.86_0_0)] border-b px-3 py-4"
            >
              <span>{item.description}</span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">
                {formatInvoiceCurrency(item.unitPrice)}
              </span>
              <span className="text-right">
                {formatInvoiceCurrency(getLineAmount(item))}
              </span>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-14 text-sm leading-relaxed">
          <section className="col-start-2 flex flex-col gap-2">
            <div>
              <div className="flex justify-between gap-8">
                <span>Net amount</span>
                <span>{formatInvoiceCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>{discountLabel}</span>
                <span>{formatInvoiceCurrency(totals.discount)}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>
                  {taxOption.name} {taxOption.rate}%
                </span>
                <span>{formatInvoiceCurrency(totals.tax)}</span>
              </div>
            </div>
            <div className="border-current border-y-2 py-3">
              <div className="flex justify-between gap-8">
                <span className="font-semibold uppercase">Balance due</span>
                <span className="font-semibold">
                  {formatInvoiceCurrency(totals.total)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="mt-auto grid grid-cols-2 gap-14 text-neutral-500 text-sm leading-relaxed">
        <div>
          <p>{invoice.from.email}</p>
          <p>{invoice.from.phone}</p>
          <p>{invoice.from.website}</p>
        </div>
        <div>
          <p>Prepared for prompt processing.</p>
          <p>Issued by {invoice.from.issuerName}</p>
        </div>
      </footer>
    </article>
  );
}
