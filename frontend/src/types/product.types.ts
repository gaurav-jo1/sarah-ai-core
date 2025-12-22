import { z } from "zod";

export const metricsResponseSchema = z.object({
  latest_monthly_revenue: z.number(),
  latest_units_sold: z.number(),
  latest_stock_on_hand: z.number(),
  latest_top_products: z.number(),
  monthly_revenue: z.record(z.string(), z.number()),
  units_sold: z.record(z.string(), z.number()),
  stock_on_hand: z.record(z.string(), z.number()),
  top_products: z.record(z.string(), z.number()),
});

export type metricsResponse = z.infer<typeof metricsResponseSchema>;