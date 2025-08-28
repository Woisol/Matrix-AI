from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, Annotated
from datetime import datetime

from  app.schemas.general import AssignId

# 使用 Annotated 来定义自定义字符串类型
MdContent = Annotated[str, Field(description="Markdown内容")]
MdCodeContent = Annotated[str, Field(description="Markdown代码内容，注意包含```xxx```")]
CodeContent = Annotated[str, Field(description="代码内容")]

class CodeLanguage(str, Enum):
    C_CPP = "c_cpp"
    # JAVASCRIPT = "javascript"
    # TYPESCRIPT = "typescript"

class CodeFileInfo(BaseModel):
    fileName: str = Field(..., description="代码文件名")
    content: CodeContent = Field(..., description="代码内容")

class Complexity(BaseModel):
    time:str = Field(..., description="时间复杂度")
    space:str = Field(..., description="空间复杂度")

class MatrixAnalysisContent(BaseModel):
    title:str = Field(..., description="标题")
    content: MdCodeContent = Field(..., description="内容")
    complexity: Optional[Complexity] = Field(None, description="复杂度")

class MatrixAnalysisProps(BaseModel):
    content: list[MatrixAnalysisContent] = Field(..., description="分析内容参数")
    summary: Optional[MdContent]
    showInEditor: Optional[bool] = Field(None, description="「辑器中显示」按钮")

class SubmitScoreStatus(str, Enum):
    NOT_SUBMITTED = "not_submitted"
    NOT_PASSED = "not_passed"
    PASSED = "passed"
    FULL_SCORE = "full_score"

class TestSampleCreate(BaseModel):
    # input: str = Field(..., description="输入（列表）")
    # expectOutput: str = Field(..., description="期望输出（列表）")
    input: list[MdCodeContent] = Field(..., description="输入（列表）")
    expectOutput: list[MdCodeContent] = Field(..., description="期望输出（列表）")
class TestSample(TestSampleCreate):
    realOutput: list[MdCodeContent] = Field(..., description="真实输出（列表）")

class TestSampleResult(BaseModel):
    input: MdCodeContent = Field(..., description="输入（非列表）")
    expectOutput: MdCodeContent = Field(..., description="期望输出（非列表）")
    realOutput: MdCodeContent = Field(..., description="真实输出（非列表）")


class TestSubmitRequest(BaseModel):
    codeFile: CodeFileInfo = Field(..., description="提交的代码文件")
    input:str = Field(..., description="用户输入")
    language: CodeLanguage = Field(..., description="代码语言，目前仅含 c_cpp")
class SubmitRequest(BaseModel):
    codeFile: CodeFileInfo = Field(..., description="提交的代码文件")

class JudgeResult(BaseModel):
    score: float = Field(..., description="得分")
    testRealOutput: list[MdCodeContent] = Field(..., description="真实输出（列表）")

class Submit(BaseModel):
    score: float = Field(..., description="提交分数")
    time: datetime = Field(..., description="提交时间")
    #! py3.9 以上直接支持 list[] 语法而不用导入 List
    #! 在 TestSample 内使用 list 而非在外面否则(暂时不想细究())
    # 1 validation error for AssignData submit
    # Field required [type=missing, input_value={'assignId': '6f131513800...trix AI!" << endl;}`}]'}, input_type=dict]
    # For further information visit https://errors.pydantic.dev/2.9/v/missing
    testSample: list[TestSampleResult] = Field(..., description="测试样例")
    submitCode: list[CodeFileInfo] = Field(..., description="提交代码文件列表")

class AssignCreateRequest(BaseModel):
    title: str = Field(..., description="作业标题")
    description: str = Field(..., description="作业描述")
    assignOriginalCode: list[CodeFileInfo] = Field(..., description="作业原始代码")
    ddl: Optional[datetime] = Field(None, description="作业截止时间")

class AssignData(BaseModel):
    assignId: AssignId = Field(..., description="作业ID")
    title: str = Field(..., description="作业标题")
    description: str = Field(..., description="作业描述")
    assignOriginalCode: list[CodeFileInfo] = Field(..., description="作业原始代码")
    submit: Optional[Submit] = Field(None, description="作业提交记录")

#**----------------------------Matrix-Analysis-----------------------------------------------------

class BasicAnalysis(BaseModel):
    resolution:Optional[MatrixAnalysisProps] = Field(None, description="题目解答")
    knowledgeAnalysis: Optional[MatrixAnalysisProps] = Field(None, description="知识点分析")

class AiGenAnalysis(BaseModel):
    codeAnalysis:Optional[ MatrixAnalysisProps] = Field(None, description="当前代码分析")
    learningSuggestions: Optional[MatrixAnalysisProps] = Field(None, description="学习建议")

class Analysis(BaseModel):
    basic: BasicAnalysis = Field(..., description="基础分析")
    aiGen: Optional[AiGenAnalysis] = Field(None, description="AI生成分析")
