from typing import Callable

class AIPrompt:
    BASE_ROLE: str = "你是一个资深的 C/C++ 编程作业助教,专业性强并且从不出错，擅长使用简洁易懂的语言帮助学生理解编程题目和代码，同时针对学生的代码水平进行相应的指导和建议"

    @staticmethod
    def TITLE(content: str) -> str:
        """通用，输入文字自动概括生成标题"""

        return f"""{AIPrompt.BASE_ROLE}现在请你阅读下面的文字，使用 2~6 个字概括作为其标题：

        {content}

        注意，你只需要给出标题，禁止给出其它任何解释。
        """


    @staticmethod
    def TITLE_CODE(code: str) -> str:
        """输入代码，让AI根据解法生成标题"""

        return f"""{AIPrompt.BASE_ROLE}现在请你分析下面的代码，使用 2~6 个字概括这个解法最根本的原理作为其标题：

        {code}

        注意，你只需要给出标题，禁止给出其它任何解释。
        """

    @staticmethod
    def COMPLEXITY(code: str) -> str:
        """输入代码，让AI分析时间复杂度和空间复杂度"""

        return f"""{AIPrompt.BASE_ROLE}现在请你分析下面的代码，给出其时间复杂度和空间复杂度：

        {code}

        注意，你只需要给出时间复杂度和空间复杂度，分两行输出，禁止给出其它任何解释。
        """

    @staticmethod
    def RESOLUTION(title: str, description: str, assignOriginalCode: str) -> str:
        """输入题目标题、描述和初始代码，让AI生成多个解法代码"""

        return f"""{AIPrompt.BASE_ROLE}你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
        题干：【{title}】{description}
        题目给出的初始代码如下：

        {assignOriginalCode}

        请你仔细分析题干与初始代码，给出多个题目的可能解法代码，使用 --- 分隔。注意你只需要给出代码部分并使用 --- 分隔，不要生成标题或其余信息，禁止给出其它任何解释。
        """

    @staticmethod
    def KNOWLEDGEANALYSIS(title: str, description: str, assignOriginalCode: str) -> str:
        """输入题目标题、描述和初始代码，让AI生成知识点分析"""

        return f"""{AIPrompt.BASE_ROLE}你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
        题干：【{title}】{description}
        题目给出的初始代码如下：

        {assignOriginalCode}

        请你仔细分析题干与初始代码，给出题目可能涉及的知识点，使用 --- 分隔。注意你只需要给出知识点文段并使用 --- 分隔，禁止给出其它任何解释。
        """
    
    @staticmethod
    def CODEANALYSIS(title: str, description: str, stu_content: str) -> str:
        """输入题目标题、描述和学生代码，让AI生成代码分析"""

        return f"""{AIPrompt.BASE_ROLE}你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
        题干：【{title}】{description}
        学生提交的代码如下：

        {stu_content}

        请你仔细分析题干与学生代码，给出代码的优缺点与代码质量分析，并指出知识掌握的不足之处。使用 --- 分隔。注意你只需要给出代码分析内容并使用 --- 分隔，禁止给出其它任何解释。
        """


    @staticmethod
    def LEARNING_SUGGESTIONS(title: str, description: str, assignOriginalCode: str) -> str:
        """输入题目标题、描述和初始代码，让AI生成学习建议"""
        return f"""{AIPrompt.BASE_ROLE}你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
        题干：【{title}】{description}
        题目给出的初始代码如下：

        {assignOriginalCode}

        请你仔细分析题干与初始代码，给出针对这道题目的学习建议和解题思路，帮助学生更好地理解和掌握相关知识点。注意你只需要给出学习建议内容，禁止给出其它任何解释。
        """
