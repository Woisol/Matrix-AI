import os
import asyncio
import tempfile
import logging
from pathlib import Path
from typing import Optional

# from app.schemas.general import
from app.schemas.assignment import CodeContent, CodeLanguage, JudgeResult, TestSampleCreate, MdCodeContent


class Playground:
    """代码运行和测试环境简要实现（单文件 C/C++）"""
    # def __init__(self):
    #     sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

    @staticmethod
    def _get_firejail_args(tmpdir: str) -> list[str]:
        """生成安全的 firejail 参数配置"""
        return [
            "firejail",
            "--quiet",                    # 减少输出噪音
            "--noprofile",               # 不使用默认配置文件
            "--net=none",                # 禁用网络访问
            "--noroot",                  # 禁止root权限
            "--nosound",                 # 禁用音频设备
            "--novideo",                 # 禁用视频设备
            "--no3d",                    # 禁用3D加速
            "--nodvd",                   # 禁用DVD设备
            "--notv",                    # 禁用TV设备
            "--nou2f",                   # 禁用U2F设备
            "--seccomp",                 # 启用seccomp过滤
            "--caps.drop=all",           # 删除所有capabilities
            "--nonewprivs",              # 禁止获取新权限
            "--nogroups",                # 禁用supplementary groups
            # "--shell=none",              # 禁用shell访问
            "--private-dev",             # 私有/dev目录
            "--private-tmp",             # 私有/tmp目录
            f"--private={tmpdir}",       # 限制只能访问工作目录
            "--private-etc=passwd,group,hostname,hosts,nsswitch.conf,resolv.conf", # 最小的/etc访问
            "--timeout=00:00:10",        # 10秒超时限制
            "--rlimit-cpu=5",            # CPU时间限制5秒
            "--rlimit-as=268435456",     # 内存限制256MB
            "--rlimit-fsize=10485760",   # 文件大小限制10MB
        ]

    @staticmethod
    async def run_code(code: CodeContent, input: str, language: CodeLanguage) -> str:
        if language != CodeLanguage.C_CPP:
            return "Unsupported language: only c_cpp is available for now."

        # 检查 firejail 是否可用（非Windows系统强制要求）
        firejail_available = False
        if os.name != "nt":  # 非Windows系统
            try:
                proc = await asyncio.create_subprocess_exec(
                    "firejail", "--version",
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                await asyncio.wait_for(proc.communicate(), timeout=5)
                if proc.returncode == 0:
                    firejail_available = True
                else:
                    return "Security Error: firejail is required for safe code execution on this system, but firejail command failed. Please ensure firejail is properly installed and configured."
            except FileNotFoundError:
                return "Security Error: firejail is required for safe code execution on this system, but firejail is not installed. Please install firejail using your system package manager (e.g., 'sudo dnf install firejail')."
            except asyncio.TimeoutError:
                return "Security Error: firejail version check timed out. Please check your firejail installation."
            except Exception as e:
                return f"Security Error: failed to check firejail availability: {e}. Please ensure firejail is properly installed."
        else:
            # Windows系统，使用现有逻辑（无沙箱）
            firejail_available = False

        # 选择编译器：优先 g++，其次 gcc（加 -x c++）
        compiler_cmd = None
        candidate_cmds = [
            ["g++"],
            ["gcc", "-x", "c++"],
        ]

        # Windows 下可执行文件后缀
        exe_suffix = ".exe" if os.name == "nt" else ""

        # 创建临时目录与源文件
        try:
            with tempfile.TemporaryDirectory(prefix="playground_") as tmpdir:
                tmp = Path(tmpdir)
                src_path = tmp / "main.cpp"
                exe_path = tmp / f"main{exe_suffix}"

                # 写入源代码
                src_path.write_text(code, encoding="utf-8")

                # 选择可用编译器
                for base in candidate_cmds:
                    try:
                        # 简单探测：尝试运行 <cmd> --version
                        proc = await asyncio.create_subprocess_exec(
                            *base, "--version",
                            stdout=asyncio.subprocess.PIPE,
                            stderr=asyncio.subprocess.PIPE,
                        )
                        await asyncio.wait_for(proc.communicate(), timeout=5)
                        if proc.returncode == 0:
                            compiler_cmd = base
                            break
                    except Exception:
                        continue

                if compiler_cmd is None:
                    return "Compiler not found: please install g++/gcc and ensure it's in PATH."

                compile_cmd = compiler_cmd + [
                    str(src_path),
                    "-O2",
                    "-std=c++17",
                    "-o",
                    str(exe_path),
                ]

                compile_proc = await asyncio.create_subprocess_exec(
                    *compile_cmd,
                    cwd=str(tmp),
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                try:
                    c_stdout, c_stderr = await asyncio.wait_for(compile_proc.communicate(), timeout=15)
                except asyncio.TimeoutError:
                    try:
                        compile_proc.kill()
                    except Exception:
                        pass
                    return "Compile Timeout"

                if compile_proc.returncode != 0:
                    compile_error = c_stderr.decode("utf-8", errors="replace") or c_stdout.decode("utf-8", errors="replace")
                    return f"Compile Error:\n{compile_error}"

                # 运行
                if firejail_available:
                    # 使用 firejail 进行安全执行
                    firejail_args = Playground._get_firejail_args(str(tmp))
                    run_cmd = firejail_args + [f"./main{exe_suffix}"]
                else:
                    # Windows系统：直接执行（无沙箱）
                    run_cmd = [str(exe_path)]

                run_proc = await asyncio.create_subprocess_exec(
                    *run_cmd,
                    cwd=str(tmp),
                    stdin=asyncio.subprocess.PIPE,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                try:
                    r_stdout, r_stderr = await asyncio.wait_for(
                        run_proc.communicate(input.encode("utf-8") if input else None),
                        timeout=5,
                    )
                except asyncio.TimeoutError:
                    try:
                        run_proc.kill()
                    except Exception:
                        pass
                    return "Runtime Timeout"

                if run_proc.returncode != 0:
                    # 返回运行时错误输出
                    err = r_stderr.decode("utf-8", errors="replace")
                    out = r_stdout.decode("utf-8", errors="replace")
                    return (err or out) or f"Process exited with code {run_proc.returncode}"

                # print(f"Raw output: {r_stdout.decode('utf-8', errors='replace')}")
                return r_stdout.decode("utf-8", errors="replace")
        except Exception as e:
            return f"Runner Error: {e}"
    async def judge_code(code:CodeContent, testSample: TestSampleCreate)-> JudgeResult:
        try:
            # 保护：空的测试样例直接返回
            if not testSample.input or len(testSample.input) == 0:
                logging.warning("judge_code called with empty testSample.input")
                return JudgeResult(score=100, testRealOutput=[]) # 无测试数据先直接满分……

            score = 0
            testRealOutput:list[MdCodeContent] = []
            for i in range(len(testSample.input)):
                try:
                    output = await Playground.run_code(
                        code=code,
                        input=testSample.input[i],
                        language=CodeLanguage.C_CPP,
                    )
                except Exception as run_ex:
                    # 单个用例运行失败时记录错误字符串，不中断整个判题流程
                    logging.exception(f"run_code failed for test index {i}: {run_ex}")
                    output = f"Runner Error: {run_ex}"

                testRealOutput.append(output)
                try:
                    if output is not None and output.strip() == testSample.expectOutput[i].strip():
                        score += 1
                except Exception:
                    # 如果对比发生错误，继续下一个用例
                    logging.exception(f"Comparison failed for test index {i}")

            # 计算分数，避免除以零
            total = len(testSample.input)
            final_score = int(score / total * 100) if total else 0
            return JudgeResult(score=final_score, testRealOutput=testRealOutput)
        except Exception as e:
            logging.exception(f"judge_code encountered an unexpected error: {e}")
            # 返回与测试输入相同长度的错误占位，便于前端显示
            try:
                length = len(testSample.input) if testSample and testSample.input else 0
            except Exception:
                length = 0
            return JudgeResult(score=0, testRealOutput=[f"Error: {e}" for _ in range(length)])
