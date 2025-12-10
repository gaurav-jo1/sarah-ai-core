import { z } from "zod";

export const ProductDataSchema = z.object({
  id: z.uuid(),
  Product_ID: z.string(),
  Product_Name: z.string(),
  Category: z.string(),
  Period: z.string(),
  Current_Price: z.float32(),
  Opening_Price: z.float32(),
  Cost_Per_Unit: z.float32(),
  Units_Sold: z.number(),
  Opening_Stock: z.number(),
  Stock_Received: z.number(),
});

export const metricsResponseSchema = z.object({
  latest_monthly_revenue: z.float32(),
  latest_units_sold: z.number(),
  latest_stock_on_hand: z.number(),
  latest_top_products: z.number(),
  monthly_revenue: z.record(z.string(), z.float32()),
  units_sold: z.record(z.string(), z.number()),
  stock_on_hand: z.record(z.string(), z.number()),
  top_products: z.record(z.string(), z.number()),
});

export const DataResponseSchema = z.array(ProductDataSchema);

export type ProductData = z.infer<typeof ProductDataSchema>;
export type DataResponse = z.infer<typeof DataResponseSchema>;
export type metricsResponse = z.infer<typeof metricsResponseSchema>;