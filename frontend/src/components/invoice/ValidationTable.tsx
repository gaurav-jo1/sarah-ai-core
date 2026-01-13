import React from "react";
import type { LineItem } from "../../types/invoice.types";

import { CheckCircle, AlertTriangle, FileText } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const ValidationTable: React.FC<{ items: LineItem[] }> = ({ items }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white mb-8">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-indigo-600" />
          Line Item Analysis
        </h3>
        <span className="text-xs font-medium px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full">
          {items.length} Items Found
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-medium">Product / Description</th>
              <th className="px-4 py-3 font-medium text-right">PO Qty</th>
              <th className="px-4 py-3 font-medium text-right">Inv Qty</th>
              <th className="px-4 py-3 font-medium text-right">PO Price</th>
              <th className="px-4 py-3 font-medium text-right">Inv Price</th>
              <th className="px-4 py-3 font-medium text-right">Total (PO)</th>
              <th className="px-4 py-3 font-medium text-right">Total (Inv)</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const poTotal = item.po_quantity * item.po_price;
              const invTotal = item.invoice_quantity * item.invoice_price;
              const isMatch =
                item.po_quantity === item.invoice_quantity &&
                Math.abs(item.po_price - item.invoice_price) < 0.01;

              return (
                <tr
                  key={index}
                  className={`hover:bg-slate-50 transition-colors ${
                    !isMatch ? "bg-red-50/30" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {item.product_or_description}
                  </td>
                  <td className="px-4 py-4 text-slate-600 text-right">
                    {item.po_quantity}
                  </td>
                  <td
                    className={`px-4 py-4 text-right font-medium ${
                      item.po_quantity !== item.invoice_quantity
                        ? "text-red-600"
                        : "text-slate-600"
                    }`}
                  >
                    {item.invoice_quantity}
                  </td>
                  <td className="px-4 py-4 text-slate-600 text-right">
                    {formatCurrency(item.po_price)}
                  </td>
                  <td
                    className={`px-4 py-4 text-right font-medium ${
                      Math.abs(item.po_price - item.invoice_price) >= 0.01
                        ? "text-red-600"
                        : "text-slate-600"
                    }`}
                  >
                    {formatCurrency(item.invoice_price)}
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-right">
                    {formatCurrency(poTotal)}
                  </td>
                  <td className="px-4 py-4 text-slate-800 font-medium text-right">
                    {formatCurrency(invTotal)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {isMatch ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <div className="flex justify-center group relative">
                        <AlertTriangle className="w-5 h-5 text-amber-500 cursor-help" />
                        <span className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Discrepancy detected
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationTable;
