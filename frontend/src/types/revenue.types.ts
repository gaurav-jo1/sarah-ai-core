import { z } from "zod";

export const RevenueDataItemSchema = z.object({
  product_id: z.string(),
  period: z.string(),
  revenue: z.number(),
  units_sold: z.number(),
});

export const RevenuePredictionItemSchema = z.object({
  product_id: z.string(),
  period: z.string(),
  target_name: z.literal("revenue"),
  predictions: z.number(),
  revenue_0_1: z.number(),
  revenue_0_5: z.number(),
  "revenue_0.9": z.number(),
});

export const RevenueResponseSchema = z.object({
  products_name: z.record(z.string(), z.string()),
  data: z.array(RevenueDataItemSchema),
  prediction: z.array(RevenuePredictionItemSchema),
});

export type RevenueResponse = z.infer<typeof RevenueResponseSchema>;