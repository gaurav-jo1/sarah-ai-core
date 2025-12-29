import { z } from "zod";

export const InventoryItemSchema = z.object({
    id: z.number(),
    Product_ID: z.string(),
    Product_Name: z.string(),
    Category: z.string(),
    Period: z.string(),
    Current_Price: z.number(),
    Opening_Price: z.number(),
    Cost_Per_Unit: z.number(),
    Units_Sold: z.number(),
    Opening_Stock: z.number(),
    Stock_Received: z.number(),
    Revenue: z.number(),
    Stock_On_Hand: z.number(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export interface AiInsightsInventoryItem {
    product_id: string;
    product_name: string;
    period: string;
    opening_stock: number;
    stock_received: number;
    units_sold: number;
    stock_on_hand: number;
    current_price: number;
    cost_per_unit: number;
    prediction_3m: number;
    predicted_stockout_month: string;
    margin_per_unit: number;
    total_projected_profit_3m: number;
    total_projected_revenue_3m: number;
    replenishment_needed: number;
}

export interface AiInsightsResponse {
    inventory: AiInsightsInventoryItem[];
    summary: string;
}
