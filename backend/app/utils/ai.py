def code_md_wrapper(code: str) -> str:
    """将代码块格式化为带有语言标记的Markdown格式"""
    import re

    # 移除原有的代码块标记
    # 匹配 ```语言 开始和 ``` 结束的代码块
    cleaned_code = re.sub(r'^```[\w]*\n?', '', code.strip())
    cleaned_code = re.sub(r'\n?```$', '', cleaned_code)

    return f"```cpp\n{cleaned_code}\n```"
