export interface LineItem {
    product_or_description: string;
    po_quantity: number;
    po_price: number;
    invoice_quantity: number;
    invoice_price: number;
}

export interface InvoiceSummary {
    total: number;
    vat_19_percent: number;
    gross_amount_incl_vat: number;
}

export interface POSummary {
    subtotal_without_vat: number;
    tax_rate: string;
    total_vat: number;
    grand_total: number;
}

export interface IssuerDetails {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
}

export interface ResponseData {
    issuer_details: IssuerDetails;
    line_item_matches: LineItem[];
}

export interface ApiResponse {
    response: ResponseData;
    invoice_summary: InvoiceSummary;
    po_summary: POSummary;
}

export interface LocationState {
    file: File | null;
}
