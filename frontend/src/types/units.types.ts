import { z } from "zod";

// Schema for Units Response
export const UnitsDataItemSchema = z.object({
  product_id: z.string(),
  period: z.string(),
  units_sold: z.number(),
});

export const UnitsPredictionItemSchema = z.object({
  product_id: z.string(),
  period: z.string(),
  target_name: z.literal("units_sold"),
  predictions: z.number(),
  units_0_1: z.number(),
  units_0_5: z.number(),
  units_0_9: z.number(),
});

export const UnitsResponseSchema = z.object({
  products_name: z.record(z.string(), z.string()),
  data: z.array(UnitsDataItemSchema),
  prediction: z.array(UnitsPredictionItemSchema),
});

export type UnitsResponse = z.infer<typeof UnitsResponseSchema>;
