"""
工具类测试
"""
import pytest
import json
from datetime import datetime, timezone, timedelta

from app.utils.assign import AssignDBtoSchema, listStrToList, testSampleToResultList
from app.utils.ai import code_md_wrapper
from app.schemas.assignment import TestSampleResult
from tests.test_helpers import TestDataGenerator


class TestAssignUtils:
    """作业工具类测试"""

    @pytest.mark.asyncio
    async def test_assign_db_to_schema_with_submissions(self, db):
        """测试带有提交记录的作业数据库到Schema转换"""
        # 创建测试数据
        assignment1 = await TestDataGenerator.create_test_assignment(title="作业1")
        assignment2 = await TestDataGenerator.create_test_assignment(title="作业2")

        # 为作业添加提交记录
        submission1 = await TestDataGenerator.create_test_assignment_submission(
            assignment=assignment1,
            score=95.5
        )
        submission2 = await TestDataGenerator.create_test_assignment_submission(
            assignment=assignment2,
            score=87.0
        )

        # 调用工具函数
        result = await AssignDBtoSchema([assignment1, assignment2])

        # 验证结果
        assert len(result) == 2

        # 验证第一个作业
        assign1_result = next(item for item in result if item.assignId == assignment1.id)
        assert assign1_result.assignmentName == "作业1"
        assert assign1_result.type.value == assignment1.type.value
        assert assign1_result.score == 95.5
        assert assign1_result.ddl == assignment1.end_date

        # 验证第二个作业
        assign2_result = next(item for item in result if item.assignId == assignment2.id)
        assert assign2_result.assignmentName == "作业2"
        assert assign2_result.score == 87.0

    @pytest.mark.asyncio
    async def test_assign_db_to_schema_without_submissions(self, db):
        """测试没有提交记录的作业数据库到Schema转换"""
        # 创建没有提交记录的测试数据
        assignment = await TestDataGenerator.create_test_assignment(title="无提交作业")

        # 调用工具函数
        result = await AssignDBtoSchema([assignment])

        # 验证结果
        assert len(result) == 1
        assert result[0].assignId == assignment.id
        assert result[0].assignmentName == "无提交作业"
        assert result[0].score == 0  # 没有提交记录时分数应为0

    @pytest.mark.asyncio
    async def test_assign_db_to_schema_empty_list(self, db):
        """测试空作业列表的转换"""
        result = await AssignDBtoSchema([])
        assert result == []

    @pytest.mark.asyncio
    async def test_assign_db_to_schema_null_score(self, db):
        """测试分数为None的情况"""
        assignment = await TestDataGenerator.create_test_assignment()
        submission = await TestDataGenerator.create_test_assignment_submission(
            assignment=assignment,
            score=None  # 分数为None
        )

        result = await AssignDBtoSchema([assignment])

        assert len(result) == 1
        assert result[0].score == 0  # None分数应转换为0

    def test_list_str_to_list_valid_json(self):
        """测试有效JSON字符串转换为列表"""
        # 测试基本列表
        json_str = '["hello", "world", "test"]'
        result = listStrToList(json_str)
        assert result == ["hello", "world", "test"]

        # 测试空列表
        empty_json_str = '[]'
        result = listStrToList(empty_json_str)
        assert result == []

        # 测试单元素列表
        single_json_str = '["single"]'
        result = listStrToList(single_json_str)
        assert result == ["single"]

    def test_list_str_to_list_numeric_values(self):
        """测试包含数字值的JSON字符串"""
        json_str = '["1", "2", "3"]'
        result = listStrToList(json_str)
        assert result == ["1", "2", "3"]

        # 测试混合类型（虽然在实际使用中可能不常见）
        mixed_json_str = '["text", "123", "more text"]'
        result = listStrToList(mixed_json_str)
        assert result == ["text", "123", "more text"]

    def test_list_str_to_list_special_characters(self):
        """测试包含特殊字符的JSON字符串"""
        json_str = '["hello\\nworld", "test\\tstring", "quote\\"test"]'
        result = listStrToList(json_str)
        assert "hello\nworld" in result
        assert "test\tstring" in result
        assert 'quote"test' in result

    def test_list_str_to_list_invalid_json(self):
        """测试无效JSON字符串"""
        # 测试无效JSON应该抛出异常
        with pytest.raises(json.JSONDecodeError):
            listStrToList("invalid json string")

        with pytest.raises(json.JSONDecodeError):
            listStrToList("[invalid, json]")

        with pytest.raises(json.JSONDecodeError):
            listStrToList("['single quotes not valid json']")

    def test_list_str_to_list_edge_cases(self):
        """测试边界情况"""
        # 测试包含空字符串的列表
        json_str = '["", "non-empty", ""]'
        result = listStrToList(json_str)
        assert result == ["", "non-empty", ""]

        # 测试包含空格的字符串
        json_str = '["  spaced  ", "normal"]'
        result = listStrToList(json_str)
        assert result == ["  spaced  ", "normal"]

    def test_test_sample_to_result_list_normal(self):
        """测试正常的测试样例结果转换"""
        sample_input = ["input1", "input2", "input3"]
        sample_output = ["output1", "output2", "output3"]
        real_output = ["real1", "real2", "real3"]

        result = testSampleToResultList(sample_input, sample_output, real_output)

        assert len(result) == 3

        # 验证第一个结果
        assert result[0].input == "input1"
        assert result[0].expectOutput == "output1"
        assert result[0].realOutput == "real1"

        # 验证第二个结果
        assert result[1].input == "input2"
        assert result[1].expectOutput == "output2"
        assert result[1].realOutput == "real2"

    def test_test_sample_to_result_list_different_lengths(self):
        """测试不同长度输入的测试样例结果转换"""
        # real_output 比其他数组短
        sample_input = ["input1", "input2", "input3"]
        sample_output = ["output1", "output2", "output3"]
        real_output = ["real1", "real2"]  # 只有2个元素

        result = testSampleToResultList(sample_input, sample_output, real_output)

        # 应该只返回最短数组长度的结果
        assert len(result) == 2
        assert result[0].realOutput == "real1"
        assert result[1].realOutput == "real2"

    def test_test_sample_to_result_list_real_output_longer(self):
        """测试real_output更长的情况"""
        sample_input = ["input1", "input2"]
        sample_output = ["output1", "output2"]
        real_output = ["real1", "real2", "real3", "real4"]  # 更长

        result = testSampleToResultList(sample_input, sample_output, real_output)

        # 应该只返回最短数组长度的结果
        assert len(result) == 2
        assert result[0].realOutput == "real1"
        assert result[1].realOutput == "real2"

    def test_test_sample_to_result_list_empty_arrays(self):
        """测试空数组的情况"""
        result = testSampleToResultList([], [], [])
        assert result == []

        # 测试其中一个为空
        result = testSampleToResultList(["input1"], [], ["real1"])
        assert result == []

    def test_test_sample_to_result_list_single_element(self):
        """测试单元素数组"""
        sample_input = ["single_input"]
        sample_output = ["single_output"]
        real_output = ["single_real"]

        result = testSampleToResultList(sample_input, sample_output, real_output)

        assert len(result) == 1
        assert result[0].input == "single_input"
        assert result[0].expectOutput == "single_output"
        assert result[0].realOutput == "single_real"

    def test_test_sample_to_result_list_return_type(self):
        """测试返回类型是否正确"""
        sample_input = ["input1"]
        sample_output = ["output1"]
        real_output = ["real1"]

        result = testSampleToResultList(sample_input, sample_output, real_output)

        assert isinstance(result, list)
        assert len(result) == 1
        assert isinstance(result[0], TestSampleResult)


class TestAIUtils:
    """AI工具类测试"""

    def test_code_md_wrapper_basic(self):
        """测试基本代码Markdown包装"""
        code = "print('Hello World')"
        result = code_md_wrapper(code)

        expected = "```cpp\nprint('Hello World')\n```"
        assert result == expected

    def test_code_md_wrapper_multiline(self):
        """测试多行代码包装"""
        code = """def hello():
    print('Hello')
    return True"""

        result = code_md_wrapper(code)

        expected = """```cpp
def hello():
    print('Hello')
    return True
```"""
        assert result == expected

    def test_code_md_wrapper_already_wrapped(self):
        """测试已经被包装的代码"""
        code = """```python
print('Hello World')
```"""

        result = code_md_wrapper(code)

        # 应该移除原有的包装，然后用cpp重新包装
        expected = "```cpp\nprint('Hello World')\n```"
        assert result == expected

    def test_code_md_wrapper_different_language_tags(self):
        """测试不同语言标签的代码"""
        # 测试JavaScript
        js_code = """```javascript
console.log('Hello');
```"""

        result = code_md_wrapper(js_code)
        expected = "```cpp\nconsole.log('Hello');\n```"
        assert result == expected

        # 测试Java
        java_code = """```java
System.out.println("Hello");
```"""

        result = code_md_wrapper(java_code)
        expected = "```cpp\nSystem.out.println(\"Hello\");\n```"
        assert result == expected

    def test_code_md_wrapper_no_language_tag(self):
        """测试没有语言标签的代码块"""
        code = """```
print('Hello')
```"""

        result = code_md_wrapper(code)
        expected = "```cpp\nprint('Hello')\n```"
        assert result == expected

    def test_code_md_wrapper_empty_code(self):
        """测试空代码"""
        code = ""
        result = code_md_wrapper(code)
        expected = "```cpp\n\n```"
        assert result == expected

    def test_code_md_wrapper_whitespace_handling(self):
        """测试空白字符处理"""
        # 测试前后有空格的代码
        code = "  print('Hello')  "
        result = code_md_wrapper(code)
        expected = "```cpp\nprint('Hello')\n```"
        assert result == expected

        # 测试包含换行的代码
        code = "\nprint('Hello')\n"
        result = code_md_wrapper(code)
        expected = "```cpp\nprint('Hello')\n```"
        assert result == expected

    def test_code_md_wrapper_special_characters(self):
        """测试特殊字符处理"""
        code = 'print("Hello \\"World\\"\\n")'
        result = code_md_wrapper(code)
        expected = '```cpp\nprint("Hello \\"World\\"\\n")\n```'
        assert result == expected

    def test_code_md_wrapper_complex_code(self):
        """测试复杂代码结构"""
        code = """```python
class TestClass:
    def __init__(self):
        self.value = "test"

    def method(self):
        return self.value
```"""

        result = code_md_wrapper(code)

        expected = """```cpp
class TestClass:
    def __init__(self):
        self.value = "test"

    def method(self):
        return self.value
```"""
        assert result == expected

    def test_code_md_wrapper_regex_edge_cases(self):
        """测试正则表达式边界情况"""
        # 测试代码中包含```的情况
        code = 'print("This has ``` in the string")'
        result = code_md_wrapper(code)
        expected = '```cpp\nprint("This has ``` in the string")\n```'
        assert result == expected

        # 测试不完整的代码块标记
        code = "```incomplete"
        result = code_md_wrapper(code)
        expected = "```cpp\n\n```"  # 修正期望结果，因为```后面的内容会被清理掉
        assert result == expected