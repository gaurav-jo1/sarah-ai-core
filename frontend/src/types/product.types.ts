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

export const DataResponseSchema = z.array(ProductDataSchema);

export type ProductData = z.infer<typeof ProductDataSchema>;
export type DataResponse = z.infer<typeof DataResponseSchema>;