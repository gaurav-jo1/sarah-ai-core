import React from "react";
import { CheckCircle, FileText, Calculator } from "lucide-react";

import type {
  LineItem,
  InvoiceSummary,
  POSummary,
} from "../../types/invoice.types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const ValidationSummaryCards: React.FC<{
  invoice: InvoiceSummary;
  po: POSummary;
  lineItems: LineItem[];
}> = ({ invoice, po, lineItems }) => {
  const subtotalMatch =
    Math.abs(po.subtotal_without_vat - invoice.total) < 0.05;

  const mismatchedItems = lineItems.filter((item) => {
    const qtyMatch = item.po_quantity === item.invoice_quantity;
    const priceMatch = Math.abs(item.po_price - item.invoice_price) < 0.01;
    return !qtyMatch || !priceMatch;
  });

  const priceDiscrepancies = mismatchedItems.filter(
    (item) => Math.abs(item.po_price - item.invoice_price) >= 0.01
  );
  const qtyDiscrepancies = mismatchedItems.filter(
    (item) => item.po_quantity !== item.invoice_quantity
  );

  const priceDiffTotal = priceDiscrepancies.reduce((acc, item) => {
    const poTotal = item.po_quantity * item.po_price;
    const invTotal = item.invoice_quantity * item.invoice_price;
    return acc + (invTotal - poTotal);
  }, 0);

  const calculatedPOSubtotal = lineItems.reduce(
    (sum, item) => sum + item.po_quantity * item.po_price,
    0
  );
  const calculatedInvoiceSubtotal = lineItems.reduce(
    (sum, item) => sum + item.invoice_quantity * item.invoice_price,
    0
  );

  const poSubtotalMismatch =
    Math.abs(calculatedPOSubtotal - po.subtotal_without_vat) > 0.05;
  const invoiceSubtotalMismatch =
    Math.abs(calculatedInvoiceSubtotal - invoice.total) > 0.05;

  const isAllValid =
    subtotalMatch &&
    mismatchedItems.length === 0 &&
    !poSubtotalMismatch &&
    !invoiceSubtotalMismatch;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* PO Summary Card */}
      <div
        className={`rounded-xl border p-6 shadow-sm flex flex-col justify-between h-full ${
          poSubtotalMismatch
            ? "bg-amber-50 border-amber-200"
            : "bg-white border-slate-200"
        }`}
      >
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 flex items-center">
            <CheckCircle
              className={`w-4 h-4 mr-2 ${
                poSubtotalMismatch ? "text-amber-500" : ""
              }`}
            />
            Purchase Order Summary
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span
                className={`font-medium ${
                  poSubtotalMismatch
                    ? "text-amber-700 font-bold"
                    : "text-slate-900"
                }`}
              >
                {formatCurrency(po.subtotal_without_vat)}
              </span>
            </div>
            {poSubtotalMismatch && (
              <div className="text-xs text-amber-600 bg-amber-100/50 p-2 rounded">
                <strong>Warning:</strong> Calculated line items total (
                {formatCurrency(calculatedPOSubtotal)}) does not match summary.
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">VAT ({po.tax_rate})</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(po.total_vat)}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100 flex justify-between items-end mt-4">
          <span className="text-slate-800 font-semibold">Grand Total</span>
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(po.grand_total)}
          </span>
        </div>
      </div>

      {/* Invoice Summary Card */}
      <div
        className={`rounded-xl border p-6 shadow-sm relative overflow-hidden flex flex-col justify-between h-full ${
          invoiceSubtotalMismatch
            ? "bg-amber-50 border-amber-200"
            : "bg-white border-slate-200"
        }`}
      >
        {!invoiceSubtotalMismatch && (
          <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500" />
        )}
        {invoiceSubtotalMismatch && (
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
        )}
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 flex items-center">
            <FileText
              className={`w-4 h-4 mr-2 ${
                invoiceSubtotalMismatch ? "text-amber-500" : ""
              }`}
            />
            Invoice Summary
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span
                className={`font-medium ${
                  invoiceSubtotalMismatch
                    ? "text-amber-700 font-bold"
                    : "text-slate-900"
                }`}
              >
                {formatCurrency(invoice.total)}
              </span>
            </div>
            {invoiceSubtotalMismatch && (
              <div className="text-xs text-amber-600 bg-amber-100/50 p-2 rounded">
                <strong>Warning:</strong> Calculated line items total (
                {formatCurrency(calculatedInvoiceSubtotal)}) does not match
                summary.
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">VAT (19%)</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(invoice.vat_19_percent)}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100 flex justify-between items-end mt-4">
          <span className="text-slate-800 font-semibold">Grand Total</span>
          <span className="text-xl font-bold text-indigo-700">
            {formatCurrency(invoice.gross_amount_incl_vat)}
          </span>
        </div>
      </div>

      {/* Validation Result Card */}
      <div
        className={`rounded-xl border p-6 flex flex-col justify-between h-full ${
          !isAllValid
            ? "bg-red-50 border-red-100"
            : "bg-emerald-50 border-emerald-100"
        }`}
      >
        <div>
          <h4
            className={`text-sm font-semibold uppercase tracking-wide mb-2 flex items-center ${
              !isAllValid ? "text-red-700" : "text-emerald-700"
            }`}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Validation Result
          </h4>

          {!isAllValid ? (
            <div className="space-y-3 mt-4">
              {/* Internal Calculation Mismatches */}
              {(poSubtotalMismatch || invoiceSubtotalMismatch) && (
                <div className="bg-amber-100/50 p-2.5 rounded-lg border border-amber-200">
                  <div className="text-xs font-bold text-amber-800 uppercase mb-1">
                    Internal Calculation Error
                  </div>
                  <p className="text-xs text-amber-700">
                    The sum of line items does not equal the provided summary
                    totals for {poSubtotalMismatch ? "PO" : ""}{" "}
                    {poSubtotalMismatch && invoiceSubtotalMismatch ? "and" : ""}{" "}
                    {invoiceSubtotalMismatch ? "Invoice" : ""}.
                  </p>
                </div>
              )}

              {/* Price Discrepancies */}
              {priceDiscrepancies.length > 0 && (
                <div className="bg-red-100/50 p-2.5 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-red-800 uppercase">
                      Price Variance
                    </span>
                    <span className="text-sm font-bold text-red-700">
                      {priceDiffTotal > 0 ? "+" : ""}
                      {formatCurrency(priceDiffTotal)}
                    </span>
                  </div>
                  <ul className="text-xs text-red-700 list-disc list-inside">
                    {priceDiscrepancies.map((item, idx) => (
                      <li key={idx} className="truncate">
                        {item.product_or_description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Discrepancies */}
              {qtyDiscrepancies.length > 0 && (
                <div className="bg-red-100/50 p-2.5 rounded-lg">
                  <div className="text-xs font-bold text-red-800 uppercase mb-1">
                    Quantity Mismatch
                  </div>
                  <ul className="text-xs text-red-700 list-disc list-inside">
                    {qtyDiscrepancies.map((item, idx) => (
                      <li key={idx} className="truncate">
                        {item.product_or_description}: PO({item.po_quantity}) vs
                        Inv({item.invoice_quantity})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Global Subtotal Mismatch without specific item mismatch */}
              {!subtotalMatch &&
                priceDiscrepancies.length === 0 &&
                qtyDiscrepancies.length === 0 &&
                !poSubtotalMismatch &&
                !invoiceSubtotalMismatch && (
                  <div className="text-sm text-red-700">
                    PO Subtotal and Invoice Subtotal do not match (
                    {formatCurrency(
                      Math.abs(po.subtotal_without_vat - invoice.total)
                    )}{" "}
                    diff).
                  </div>
                )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
              <span className="text-lg font-semibold text-emerald-800">
                Match Confirmed
              </span>
              <p className="text-emerald-600 text-sm text-center">
                All line items and totals align perfectly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationSummaryCards;
