from langchain_google_genai import ChatGoogleGenerativeAI
from settings.settings import api_settings


class InventoryModel:
    def __init__(self):
        self.llm_1 = ChatGoogleGenerativeAI(
            model="gemini-3-flash-preview",
            api_key=api_settings.GEMINI_API_KEY,
            temperature=0.7,
        )

    def _inventory_prompt(self, inventory):
        prompt = f"""
        Act as a Supply Chain Strategist. Analyze the provided inventory data and provide a response strictly following the structure and formatting rules below.

        ### Formatting Rules:
        1. **Headings:** Use `###` for the three main section headers.
        2. **Bold Numbers:** Every single numerical value (quantities, dates, dollar amounts) MUST be wrapped in double asterisks, e.g., **149.0** or **23,563.63**.
        3. **Currency:** Precede all financial values with a `$` sign inside the bolding, e.g., **$5,200.00**.
        4. **Output:** Provide the answer to the query and nothing else. No introductory or concluding remarks.

        ### Example Format Reference:
        ### Stockout Risk Timeline
        [1-2 sentence summary. Ensure months like **January 2026** are bolded].

        ### Financial Projections (**[Start Month]** – **[End Month]**)
        If you maintain stock to meet the full forecasted demand, your business could achieve the following:
        * Total Projected Revenue: **$[Sum of revenue_3m]**
        * Total Projected Profit: **$[Sum of profit_3m]**
        * Top Profit Contributor: [Item Name] is your most valuable item, projected to generate **$[Value]** in profit over the next three months.

        ### Required Replenishment
        To avoid stockouts and capture the full revenue potential, you need to order at least the following quantities immediately:
        * [Item]: **[gap_to_order]** units

        ---
        **Current Inventory Data to Analyze:**
        {inventory}
        """

        return prompt

    def inventory_insight(self, inventory):
        prompt = self._inventory_prompt(inventory)
        ai_msg = self.llm_1.invoke(prompt)
        return ai_msg.content[0]["text"]
