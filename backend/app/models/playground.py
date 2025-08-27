import os
import asyncio
import tempfile
from pathlib import Path
from typing import Optional

from app.schemas.assignment import CodeContent, CodeLanguage


class Playground:
    """代码运行和测试环境简要实现（单文件 C/C++）"""

    @staticmethod
    async def run_code(code: CodeContent, input: str, language: CodeLanguage) -> str:
        if language != CodeLanguage.C_CPP:
            return "Unsupported language: only c_cpp is available for now."

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

                # 编译
                compile_proc = await asyncio.create_subprocess_exec(
                    *compiler_cmd,
                    str(src_path),
                    "-O2",
                    "-std=c++17",
                    "-o",
                    str(exe_path),
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
                    return "Compile Error:\n" + (c_stderr.decode("utf-8", errors="replace") or c_stdout.decode("utf-8", errors="replace"))

                # 运行
                run_proc = await asyncio.create_subprocess_exec(
                    str(exe_path),
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

                return r_stdout.decode("utf-8", errors="replace")
        except Exception as e:
            return f"Runner Error: {e}"
