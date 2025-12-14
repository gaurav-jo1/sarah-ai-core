import { z } from "zod";

// Schema for products_name mapping
export const ProductsNameSchema = z.record(z.string(), z.string());

// Schema for historical data items
export const DataItemSchema = z.object({
  product_id: z.string(),
  period: z.string(),
  units_sold: z.number(),
});

// Schema for prediction items
export const PredictionItemSchema = z.object({
  product_id: z.string(),
  period: z.string(),
  target_name: z.string(),
  predictions: z.number(),
  "0.1": z.number(), // 10% chance that the prediction is going to less than this.
  "0.5": z.number(),
  "0.9": z.number(), // 10% chance that the prediction is going to more than this.
});

// Main API response schema
export const ApiResponseSchema = z.object({
  products_name: ProductsNameSchema,
  data: z.array(DataItemSchema),
  prediction: z.array(PredictionItemSchema),
});

// Export inferred TypeScript types
export type ProductsName = z.infer<typeof ProductsNameSchema>;
export type DataItem = z.infer<typeof DataItemSchema>;
export type PredictionItem = z.infer<typeof PredictionItemSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;