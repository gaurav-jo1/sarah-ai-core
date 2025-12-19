from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain.agents import create_agent
from settings.settings import api_settings


class ChatGoogle:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3-flash-preview",
            api_key=api_settings.GEMINI_API_KEY,
            temperature=0,
        )
        self.db = api_settings.DATABASE_URL

    def chat(self, question: str):
        db = SQLDatabase.from_uri(self.db)
        # print(f"Dialect: {db.dialect}")
        # print(f"Available tables: {db.get_usable_table_names()}")

        toolkit = SQLDatabaseToolkit(db=db, llm=self.llm)

        tools = toolkit.get_tools()

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
            dialect=db.dialect,
            top_k=5,
        )

        agent = create_agent(
            self.llm,
            tools,
            system_prompt=system_prompt,
        )

        try:
            result = agent.invoke(
                {"messages": [{"role": "user", "content": question}]},
                config={"recursion_limit": 50},
            )

        except Exception as e:
            return f"Error: {str(e)}"

        last_message = result["messages"][-1]
        content_text = last_message["content"][0]

        return content_text
