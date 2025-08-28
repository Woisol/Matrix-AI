from typing import Callable

class AIPrompt:
    BASE_ROLE: str = "你是一个资深的 C/C++ 编程作业助教，"

    @staticmethod
    def TITLE(content: str) -> str:
        return f"""{AIPrompt.BASE_ROLE}现在请你阅读下面的文字，使用 2~6 个字概括作为其标题：

{content}

注意，你只需要给出标题，禁止给出其它任何解释。
    """

    @staticmethod
    def TITLE_CODE(code: str) -> str:
        return f"""{AIPrompt.BASE_ROLE}现在请你分析下面的代码，使用 2~6 个字概括这个解法最根本的原理作为其标题：

{code}

注意，你只需要给出标题，禁止给出其它任何解释。
    """

    @staticmethod
    def COMPLEXITY(code: str) -> str:
        return f"""{AIPrompt.BASE_ROLE}现在请你分析下面的代码，给出其时间复杂度和空间复杂度：

{code}

注意，你只需要给出时间复杂度和空间复杂度，分两行输出，禁止给出其它任何解释。
    """

    @staticmethod
    def RESOLUTION(title: str, description: str, assignOriginalCode: str) -> str:
        return f"""{AIPrompt.BASE_ROLE}你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
题干：【{title}】{description}
题目给出的初始代码如下：

{assignOriginalCode}

请你仔细分析题干与初始代码，给出多个题目的可能解法代码，使用 --- 分隔。注意你只需要给出代码部分并使用 --- 分隔，禁止给出其它任何解释。
"""

    @staticmethod
    def KNOWLEDGEANALYSIS(title: str, description: str, assignOriginalCode: str) -> str:
        return f"""{AIPrompt.BASE_ROLE}你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
题干：【{title}】{description}
题目给出的初始代码如下：

{assignOriginalCode}

请你仔细分析题干与初始代码，给出题目可能涉及的知识点，使用 --- 分隔。注意你只需要给出知识点文段并使用 --- 分隔，禁止给出其它任何解释。
"""
