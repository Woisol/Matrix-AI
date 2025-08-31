from typing import Callable

class AIPrompt:
    BASE_ROLE: str = "你是一个资深的 C/C++ 编程作业助教,专业性强并且从不出错，擅长使用简洁易懂的语言帮助学生理解编程题目和代码，同时针对学生的代码水平进行相应的指导和建议"
    RULE_SPLIT = "使用 --- 分隔，而不要使用列表，编号，或者其它任何分隔方式"

    @staticmethod
    def TITLE(content: str) -> str:
        """通用，输入文字自动概括生成标题"""

        return f"""{AIPrompt.BASE_ROLE}，现在请你阅读下面的文字，使用 2~6 个字概括作为其标题：

{content}

注意，你只需要给出标题内容，禁止给出其它多余部分例如“标题：”，禁止给出其它任何解释。
"""


    @staticmethod
    def TITLE_CODE(code: str) -> str:
        """输入代码，让AI根据解法生成标题"""

        return f"""{AIPrompt.BASE_ROLE}，现在请你分析下面的代码，使用 2~6 个字概括这个解法最根本的原理作为其标题：

{code}

注意，你只需要给出标题，禁止给出其它多余部分例如“标题：”，禁止给出其它任何解释。
"""

    @staticmethod
    def COMPLEXITY(code: str) -> str:
        """输入代码，让AI分析时间复杂度和空间复杂度"""

        return f"""{AIPrompt.BASE_ROLE}，现在请你分析下面的代码，给出其时间复杂度和空间复杂度：

{code}

注意，你只需要给出时间复杂度和空间复杂度，只包含“O(xxx)”的内容，不要任何其它例如“时间复杂度”或“空间复杂度”等文字。分两行输出，禁止给出其它任何解释。
"""


    @staticmethod
    def RESOLUTION(title: str, description: str, assignOriginalCode: str) -> str:
        """输入题目标题、描述和初始代码，让AI生成多个解法代码"""

        return f"""{AIPrompt.BASE_ROLE}，你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
题干：【{title}】{description}
题目给出的初始代码如下：

{assignOriginalCode}

请你仔细分析题干与初始代码，给出多个题目的可能解法代码，{AIPrompt.RULE_SPLIT}。注意你只需要给出代码部分并{AIPrompt.RULE_SPLIT}，不要生成标题或其余信息，禁止给出其它任何解释。
"""


    @staticmethod
    def KNOWLEDGEANALYSIS(title: str, description: str, assignOriginalCode: str) -> str:
        """输入题目标题、描述和初始代码，让AI生成知识点分析"""

        return f"""{AIPrompt.BASE_ROLE}，你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
题干：【{title}】{description}
题目给出的初始代码如下：

{assignOriginalCode}

请你仔细分析题干与初始代码，给出题目可能涉及的知识点，不同知识点之间{AIPrompt.RULE_SPLIT}。注意你只需要给出知识点文段并{AIPrompt.RULE_SPLIT}，禁止给出其它任何解释。
"""

    @staticmethod
    def CODEANALYSIS(title: str, description: str, stu_content: str, previous_code_style: str) -> str:
        """输入题目标题、描述和学生代码，让AI生成代码分析"""

# 【B迷惑行为】（int main 直接 return 0）代码简洁，直接返回0，符合题目的要求。
        return f"""{AIPrompt.BASE_ROLE}，你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
题干：【{title}】{description}
学生提交的代码如下：

{stu_content}

学生过往代码风格的报告如下：
{previous_code_style}

请你仔细分析题干与学生代码，首先在开头简要给出学生代码的时间复杂度和空间复杂度分析，给出这种实现的优缺点（如果没有可以不提），以及代码风格和代码质量分析等，同时结合学生过往的代码风格报告，指出学生的改进之处。以上内容{AIPrompt.RULE_SPLIT}。注意你只需要给出分析内容并{AIPrompt.RULE_SPLIT}，禁止给出其它任何解释。
"""
# ，并指出知识掌握的不足之处，

    @staticmethod
    def LEARNING_SUGGESTIONS(title: str, description: str, stu_content: str, previous_knowledge_status: str) -> str:
        """输入题目标题、描述和初始代码，让AI生成学习建议"""
        return f"""{AIPrompt.BASE_ROLE}，你的任务是帮助学生提高编程能力。以下是作业的详细信息：
题干：【{title}】{description}
学生提交的代码如下：

{stu_content}

学生过往的知识点掌握程度报告如下：
{previous_knowledge_status}

请你仔细分析题干与学生代码，结合学生过往知识点的掌握情况，给出你建议学生可以拓展的学习方向，{AIPrompt.RULE_SPLIT}，以此帮助学生更好地理解和掌握相关知识点。注意你只需要给出学习建议内容，各个建议之间{AIPrompt.RULE_SPLIT}，禁止给出其它任何解释。
"""

    @staticmethod
    def CODE_STYLE(previous_str:str, submission_str:str):
        return f"""{AIPrompt.BASE_ROLE}，现在你需要根据学生以往提交的代码，分析学生的代码风格

{f"你过往曾经分析过学生的代码风格，可以提供一些参考：{previous_str}" if previous_str else ""}

学生当前的提交记录如下：
{submission_str}

请你根据以上信息，重新仔细分析学生的代码风格，输出一个简短的分析报告
"""

    @staticmethod
    def KNOWLEDGE_STATUS(previous_str:str, submission_str:str):
        return f"""{AIPrompt.BASE_ROLE}，现在你需要根据学生的作业内容，分析学生的知识掌握情况

{f"你过往曾经分析过学生的知识掌握情况，可以提供一些参考：{previous_str}" if previous_str else ""}

学生当前的提交记录如下：
{submission_str}

请你根据以上信息，重新仔细分析学生的知识掌握情况，输出一个简短的分析报告
"""
