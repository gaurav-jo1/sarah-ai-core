import { z } from "zod";

export const ProductDataSchema = z.object({
  id: z.uuid(),
  Category: z.string(),
  Cost_Per_Unit: z.number(),
  Current_Price: z.number(),
  Month: z.string(),
  Month_Number: z.number(),
  Opening_Price: z.number(),
  Opening_Stock: z.number(),
  Price_Change_Percent: z.number(),
  Product_ID: z.string(),
  Product_Name: z.string(),
  Revenue: z.number(),
  Stock_On_Hand: z.number(),
  Stock_Received: z.number(),
  Units_Sold: z.number(),
  Year_Number: z.number(),
});

export const DataResponseSchema = z.array(ProductDataSchema);

export type ProductData = z.infer<typeof ProductDataSchema>;
export type DataResponse = z.infer<typeof DataResponseSchema>;