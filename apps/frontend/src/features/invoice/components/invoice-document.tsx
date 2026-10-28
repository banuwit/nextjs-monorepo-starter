import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import type { Invoice } from "../types/invoice";
import { calculateInvoice, formatMoney } from "../utils/invoice";

// Keep long references and addresses inside their columns without arbitrary truncation.
Font.registerHyphenationCallback((word) =>
  word.length > 24 ? (word.match(/.{1,16}/g) ?? [word]) : [word],
);

const styles = StyleSheet.create({
  page: {
    padding: 42,
    paddingTop: 48,
    paddingBottom: 62,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#243044",
    lineHeight: 1.5,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "2 solid #243044",
    paddingBottom: 22,
    marginBottom: 24,
  },
  brand: { width: "52%", paddingRight: 22 },
  company: {
    fontSize: 19,
    lineHeight: 1.25,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  heading: {
    fontSize: 30,
    lineHeight: 1.25,
    marginBottom: 6,
    letterSpacing: -1,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  muted: { color: "#667085" },
  small: { fontSize: 8, color: "#667085" },
  metadata: { width: "43%", textAlign: "right" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  parties: { flexDirection: "row", gap: 36, marginBottom: 28 },
  party: { width: "50%" },
  label: { fontSize: 8, color: "#667085", marginBottom: 6 },
  bold: { fontFamily: "Helvetica-Bold" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f4f7",
    paddingVertical: 9,
    paddingHorizontal: 8,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  item: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottom: "0.5 solid #e4e7ec",
  },
  description: { width: "43%", paddingRight: 12 },
  quantity: { width: "17%", paddingRight: 10 },
  price: { width: "20%", textAlign: "right", paddingLeft: 5 },
  bottom: { flexDirection: "row", gap: 36, marginTop: 26 },
  payment: { width: "51%", paddingRight: 12 },
  totals: { width: "49%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
    gap: 10,
  },
  total: { marginTop: 7, borderTop: "1 solid #243044", paddingTop: 12 },
  amount: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    lineHeight: 1.25,
    marginTop: 5,
  },
  notes: { marginTop: 28, borderTop: "0.5 solid #e4e7ec", paddingTop: 14 },
  footer: {
    position: "absolute",
    left: 42,
    right: 42,
    bottom: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#667085",
  },
});

export function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const totals = calculateInvoice(invoice);
  const money = (amount: number) => formatMoney(amount, invoice.currency);
  const date = (value: string) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${value}T12:00:00Z`));
  return (
    <Document
      title={`Invoice ${invoice.reference}`}
      author={invoice.from.name}
      subject={`Invoice for ${invoice.to.name}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          <View style={styles.brand}>
            <Text style={styles.company}>{invoice.from.name}</Text>
            <Text style={styles.muted}>{invoice.from.email}</Text>
          </View>
          <View style={styles.metadata}>
            <Text style={styles.heading}>Invoice</Text>
            <Text>{invoice.reference}</Text>
          </View>
        </View>
        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.label}>Billed to</Text>
            <Text style={styles.bold}>{invoice.to.name}</Text>
            <Text>{invoice.to.address}</Text>
            <Text>{invoice.to.email}</Text>
            {invoice.to.taxId && <Text>Tax ID: {invoice.to.taxId}</Text>}
          </View>
          <View style={styles.party}>
            <Text style={styles.label}>Invoice information</Text>
            <Text>Issued: {date(invoice.issuedDate)}</Text>
            <Text>Due: {date(invoice.dueDate)}</Text>
            <Text>Currency: {invoice.currency}</Text>
            <Text style={[styles.small, { marginTop: 10 }]}>
              {invoice.from.address}
            </Text>
            {invoice.from.taxId && (
              <Text style={styles.small}>Tax ID: {invoice.from.taxId}</Text>
            )}
          </View>
        </View>
        <View style={styles.tableHeader} minPresenceAhead={40}>
          <Text style={styles.description}>Item / description</Text>
          <Text style={styles.quantity}>Quantity</Text>
          <Text style={styles.price}>Unit price</Text>
          <Text style={styles.price}>Amount</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.quantity}>
              {item.quantity} {item.unit}
            </Text>
            <Text style={styles.price}>
              {formatMoney(item.rate, invoice.currency, 20)}
            </Text>
            <Text style={[styles.price, styles.bold]}>
              {money(totals.lines[index] ?? 0)}
            </Text>
          </View>
        ))}
        <View style={styles.bottom} wrap={false}>
          <View style={styles.payment}>
            <Text style={styles.label}>Payment details</Text>
            <Text style={styles.bold}>{invoice.bank}</Text>
            <Text>{invoice.accountName}</Text>
            <Text>{invoice.accountNumber}</Text>
            <Text style={[styles.small, { marginTop: 12 }]}>
              Payment reference: {invoice.reference}
            </Text>
          </View>
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>{money(totals.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>
                Discount
                {invoice.discountType === "percent"
                  ? ` (${invoice.discountValue}%)`
                  : ""}
              </Text>
              <Text>-{money(totals.discount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Tax ({invoice.taxRate}%)</Text>
              <Text>{money(totals.tax)}</Text>
            </View>
            <View style={styles.total}>
              <Text>Total due · {invoice.currency}</Text>
              <Text style={styles.amount}>{money(totals.total)}</Text>
            </View>
          </View>
        </View>
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.label} minPresenceAhead={20}>
              A note for you
            </Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}
        <View style={styles.footer} fixed>
          <Text>Invoice · {invoice.reference}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

export async function createInvoicePdf(invoice: Invoice) {
  return pdf(<InvoiceDocument invoice={invoice} />).toBlob();
}
