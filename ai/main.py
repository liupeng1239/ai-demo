from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_deepseek import ChatDeepSeek


@tool
def search(query: str) -> str:
    """搜索信息。"""
    return f"结果：{query}"

@tool
def get_weather(location: str) -> str:
    """获取位置的天气信息。"""
    return f"{location} 的天气：晴朗，72°F"


model = ChatDeepSeek(
    model="deepseek-chat",
    temperature=0.1,
    max_tokens=1000,
    timeout=30,
    api_key="sk-c897459855b24c18afb1a6a139ca9861",  # 你刚才发的 key
    base_url="https://api.deepseek.com/v1"  # 
)

agent = create_agent(model, tools=[search, get_weather])

agent.invoke("请帮我搜索一下关于人工智能的最新信息，并告诉我纽约的天气。")