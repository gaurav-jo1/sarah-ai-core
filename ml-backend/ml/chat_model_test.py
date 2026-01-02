from pydantic import BaseModel, Field
from typing import Literal, Annotated
from typing_extensions import TypedDict
from settings.settings import api_settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from datetime import datetime
from langgraph.graph.message import add_messages

formatted_date = datetime.now().strftime("%B %Y")

llm_1 = ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview",
    api_key=api_settings.GEMINI_API_KEY,
    temperature=0.7,
)


class MessageClassifier(BaseModel):
    message_type: Literal["normal", "forecasting", "analytical"] = Field(
        ...,
        description="Classify if the message requires a normal, forecasting or analytical response.",
    )


class State(TypedDict):
    messages: Annotated[list, add_messages]
    message_type: str | None


def classify_message(state: State):
    last_message = state["messages"][-1]
    classifier_llm = llm_1.with_structured_output(MessageClassifier)

    result = classifier_llm.input_schema(
        [
            {
                "role": "system",
                "content": f"""
                    Your task is to classify the user's intent into one of three specific categories.

                    **Current Reference Date:** {formatted_date}
                    Use this date as the "present" to determine if a request refers to the past or the future.

                    **Categories:**
                    1. "normal": General questions, greetings, or conversation. No database lookup needed.
                    2. "analysis": Retrieving or analyzing data from the past up to the present ({formatted_date}).
                    *Keywords: "What happened", "Current status", "Last month", "Previous year".*
                    3. "forecasting": Predicting future trends or data points occurring after {formatted_date}.
                    *Keywords: "What will happen", "Prediction", "Next quarter", "Future outlook".*
                """,
            },
            {"role": "user", "content": last_message.content},
        ]
    )

    return {"message_type": result.message_type}


def router(state: State):
    message_type = state.get("message_type", "normal")

    if message_type == "normal":
        return {"next": "normal"}

    elif message_type == "forecasting":
        return {"next": "forecasting"}

    return {"next": "analytical"}


def normal_agent():
    pass


def forecasting_agent():
    pass


def analytical_agent():
    pass


graph_builder = StateGraph(State)

graph_builder.add_node("classifier", classify_message)
graph_builder.add_node("router", router)
graph_builder.add_node("normal", normal_agent)
graph_builder.add_node("forecasting", forecasting_agent)
graph_builder.add_node("analytical", analytical_agent)

graph_builder.add_edge(START, "classifier")
graph_builder.add_edge("classifier", "router")
graph_builder.add_conditional_edges(
    "router",
    lambda state: state.get("next"),
    {"normal": "normal", "forecasting": "forecasting", "analytical": "analytical"},
)
graph_builder.add_edge(start_key="normal", end_key=END)
graph_builder.add_edge(start_key="forecasting", end_key=END)
graph_builder.add_edge(start_key="analytical", end_key=END)

graph = graph_builder.compile()

def run_chatbot():
    state = {"messages": [], "message_type": None}

    while True:
        user_input = input("Message: ")
        if user_input == "exit":
            print("Bye")
            break

        state["messages"].append({"role": "user", "content": user_input})
        state = graph.invoke(state)

        if state.get("messages"):
            print(f"Assistant: {state['messages'][-1]['content']}")

if __name__ == "__main__":
    run_chatbot()