def code_md_wrapper(code: str) -> str:
    """将代码块格式化为带有语言标记的Markdown格式"""
    return f"```cpp\n{code}\n```"
