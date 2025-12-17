# from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from settings.settings import api_settings


class ChatGoogle:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite", api_key=api_settings.GEMINI_API_KEY, temperature=0
        )


    def chat(self, message: str):
        return self.llm.invoke(input=message)