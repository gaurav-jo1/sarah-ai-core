from settings.settings import api_settings
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import Literal, Annotated
from pydantic import BaseModel, Field
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict
from datetime import datetime
from langgraph.graph import StateGraph, START, END
from langchain.agents import create_agent
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit


class MessageClassifier(BaseModel):
    message_type: Literal["normal", "forecasting", "analytical"] = Field(
        ...,
        description="Classify if the message requires a normal, forecasting or analytical response.",
    )


class State(TypedDict):
    messages: Annotated[list, add_messages]
    message_type: str | None
    next: str | None


class ChatModel:
    def __init__(self):
        self.llm_1 = ChatGoogleGenerativeAI(
            model="gemini-3-flash-preview",
            api_key=api_settings.GEMINI_API_KEY,
            temperature=0.7,
        )
        self.llm_2 = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            api_key=api_settings.GEMINI_API_KEY,
            temperature=0.7,
        )
        self.formatted_date = datetime.now().strftime("%B %Y")
        self.db = SQLDatabase.from_uri(api_settings.DATABASE_URL)
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm_1)
        self.tools = self.toolkit.get_tools()

    def classify_message(self, state: State):
        last_message = state["messages"][-1]
        classifier_llm = self.llm_2.with_structured_output(MessageClassifier)

        result = classifier_llm.invoke(
            [
                {
                    "role": "system",
                    "content": f"""
                        Your task is to classify the user's intent into one of three specific categories.

                        **Current Reference Date:** {self.formatted_date}
                        Use this date as the "present" to determine if a request refers to the past or the future.

                        **Categories:**
                        1. "normal": General questions, greetings, or conversation. No database lookup needed.
                        2. "analysis": Retrieving or analyzing data from the past up to the present ({self.formatted_date}).
                        *Keywords: "What happened", "Current status", "Last month", "Previous year".*
                        3. "forecasting": Predicting future trends or data points occurring after {self.formatted_date}.
                        *Keywords: "What will happen", "Prediction", "Next quarter", "Future outlook".*
                    """,
                },
                {"role": "user", "content": last_message.content},
            ]
        )

        print(result)

        return {"message_type": result.message_type}

    def router(self, state: State):
        message_type = state.get("message_type", "normal")

        if message_type == "normal":
            return {"next": "normal"}
        elif message_type == "forecasting":
            return {"next": "forecasting"}
        else:
            return {"next": "analytical"}

    def normal_agent(self, state: State):
        last_message = state["messages"][-1]

        messages = [
            {
                "role": "system",
                "content": f"""
                    # ROLE
                    You are Sarah AI, the proactive intelligence layer of a next-generation ERP system.
                    Your mission is to move the user away from "static recording" (legacy ERP) and
                    toward "active intelligence."

                    # CONTEXT
                    The user is in a general conversation or asking for non-data-specific advice.
                    While you aren't pulling live numbers in this mode, you should still sound like a
                    business partner who understands supply chains, operations, and growth.

                    # OPERATING PRINCIPLES
                    1. **Active Intelligence:** Don't just answer "what is." Think about "what's next."
                    Even in general chat, frame your answers around efficiency and proactive management.
                    2. **Persona:** Professional, insightful, and decisive. You are not a "giant calculator";
                    you are a strategist. Avoid corporate jargon; use clear, actionable language.
                    3. **The "Sarah" Difference:** If the user asks about legacy systems, remind them
                    subtly that you are here to help them manage their business, not just record it.

                    # GUIDELINES FOR "NORMAL" INTENT
                    * **Greetings:** "Hello! Ready to look at how we can optimize your operations today?"
                    * **Platform Help:** Explain how to use the "Analytical Mode" for deep dives or
                    "Forecasting Mode" for future planning.
                    * **Strategic Advice:** If asked for general business tips (e.g., "How do I improve
                    cash flow?"), provide high-level strategic frameworks.
                    * **Transitioning:** If the user starts asking for specific data (e.g., "What was my
                    revenue?"), remind them that you can analyze that if they ask for a specific report
                    or time period.

                    # REFERENCE DATE
                    Today is {self.formatted_date}. Use this to ground any general time-based advice.
                """,
            },
            {"role": "user", "content": last_message.content},
        ]
        reply = self.llm_1.invoke(messages)

        return {"messages": [{"role": "assistant", "content": reply.content}]}

    def analytical_agent(self, state: State):
        last_message = state["messages"][-1].content

        agent = create_agent(
            self.llm_1,
            self.tools,
            system_prompt="""
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
                top_k=5,
            ),
        )

        reply = agent.invoke(
            {"messages": [{"role": "user", "content": last_message}]},
            config={"recursion_limit": 50},
        )

        # last_message = result["messages"][-1]
        # if isinstance(last_message.content, list):
        #     return last_message.content[0].get("text", str(last_message.content[0]))
        # return last_message.content

        reply = reply["messages"][-1]

        return {"messages": [{"role": "assistant", "content": reply.content}]}

    def forecasting_agent(self, state: State):
        pass

    def chat(self, user_input: str):
        graph_builder = StateGraph(State)
        graph_builder.add_node("classify_message", self.classify_message)
        graph_builder.add_node("router", self.router)
        graph_builder.add_node("normal", self.normal_agent)
        graph_builder.add_node("forecasting", self.forecasting_agent)
        graph_builder.add_node("analytical", self.analytical_agent)

        graph_builder.add_edge(START, "classify_message")
        graph_builder.add_edge("classify_message", "router")
        graph_builder.add_conditional_edges(
            "router",
            lambda state: state.get("next"),
            {
                "normal": "normal",
                "forecasting": "forecasting",
                "analytical": "analytical",
            },
        )

        graph_builder.add_edge(start_key="normal", end_key=END)
        graph_builder.add_edge(start_key="forecasting", end_key=END)
        graph_builder.add_edge(start_key="analytical", end_key=END)

        graph = graph_builder.compile()

        state = {"messages": [], "message_type": None}

        state["messages"].append({"role": "user", "content": user_input})
        state = graph.invoke(state)

        llm_response = state["messages"][-1].content

        return llm_response[0]["text"]
