from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain.agents import create_agent
from settings.settings import api_settings


class ChatGoogle:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            api_key=api_settings.GEMINI_API_KEY,
            temperature=0,
        )
        self.db = SQLDatabase.from_uri(api_settings.DATABASE_URL)
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        self.tools = self.toolkit.get_tools()

        self.system_message = self._generate_prompt()

    def _generate_prompt(self, top_k: int = 5):
        system_prompt = """
            You are an agent designed to interact with a SQL database.
            Given an input question, create a syntactically correct {dialect} query to run,
            then look at the results of the query and return the answer. Unless the user
            specifies a specific number of examples they wish to obtain, always limit your
            query to at most {top_k} results.

            You can order the results by a relevant column to return the most interesting
            examples in the database. Never query for all the columns from a specific table,
            only ask for the relevant columns given the question.

            You MUST double check your query before executing it. If you get an error while
            executing a query, rewrite the query and try again.

            DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the
            database.

            To start you should ALWAYS look at the tables in the database to see what you
            can query. Do NOT skip this step.

            Then you should query the schema of the most relevant tables.
            """.format(
            dialect=self.db.dialect,
            top_k=top_k,
        )

        return system_prompt

    def chat(self, question: str):
        agent = create_agent(self.llm, self.tools, system_prompt=self.system_message)

        result = agent.invoke(
            {"messages": [{"role": "user", "content": question}]},
            config={"recursion_limit": 50},
        )

        last_message = result["messages"][-1]
        if isinstance(last_message.content, list):
            return last_message.content[0].get("text", str(last_message.content[0]))
        return last_message.content
