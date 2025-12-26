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
