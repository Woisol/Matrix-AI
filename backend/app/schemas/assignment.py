from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
from datetime import datetime

from general import AssignId

class MdContent(str):
    pass
class MdCodeContent(str):
    pass
class CodeContent(str):
    pass
class CodeLanguage(str, Enum):
    C_CPP = "c_cpp"
    # JAVASCRIPT = "javascript"
    # TYPESCRIPT = "typescript"

class CodeFileInfo(BaseModel):
    filename: str = Field(..., description="代码文件名")
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
    show_in_editor: Optional[bool] = Field(None, description="「辑器中显示」按钮")

class SubmitScoreStatus(str, Enum):
    NOT_SUBMITTED = "not_submitted"
    NOT_PASSED = "not_passed"
    PASSED = "passed"
    FULL_SCORE = "full_score"

class TestSample(BaseModel):
    input: MdCodeContent = Field(..., description="输入")
    real_output: MdCodeContent = Field(..., description="真实输出")
    expect_output: MdCodeContent = Field(..., description="期望输出")

class Submit(BaseModel):
    score: float = Field(..., description="提交分数")
    time: datetime = Field(..., description="提交时间")
    #! py3.9 以上直接支持 list[] 语法而不用导入 List
    test_sample: list[TestSample] = Field(..., description="测试样例")
    submit_code: list[CodeFileInfo] = Field(..., description="提交代码文件列表")

class AssignData(BaseModel):
    assign_id: AssignId = Field(..., description="作业ID")
    title: str = Field(..., description="作业标题")
    description: str = Field(..., description="作业描述")
    assign_original_code: list[CodeFileInfo] = Field(..., description="作业原始代码")
    submit: Optional[Submit] = Field(..., description="作业提交记录")

class BasicAnalysis(BaseModel):
    resolution:Optional[MatrixAnalysisProps] = Field(None, description="题目解答")
    knowledge_analysis: Optional[MatrixAnalysisProps] = Field(None, description="知识点分析")

class AiGenAnalysis(BaseModel):
    code_analysis:Optional[ MatrixAnalysisProps] = Field(None, description="当前代码分析")
    learning_suggestions: Optional[MatrixAnalysisProps] = Field(None, description="学习建议")

class Analysis(BaseModel):
    basic: BasicAnalysis = Field(..., description="基础分析")
    ai_gen: Optional[AiGenAnalysis] = Field(None, description="AI生成分析")
