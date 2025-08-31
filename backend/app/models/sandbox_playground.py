import os
import sys
import asyncio
import tempfile
import shutil
import subprocess
import resource
import logging
from pathlib import Path
from typing import Optional, Dict, Any, List

from app.schemas.assignment import CodeContent, CodeLanguage, JudgeResult, TestSampleCreate, MdCodeContent


class SandboxPlayground:
    """安全沙盒代码运行和测试环境（专为 LoongArch/龙芯 优化）"""

    def __init__(self, debug: bool = False):
        self.debug = debug
        self.is_linux = os.name == 'posix'
        self.logger = self._setup_logger() if debug else None

        # 检测编译器和系统环境
        self.compiler_info = None
        self.sandbox_supported = self.is_linux

        if self.is_linux:
            self._detect_compiler()

    def _setup_logger(self):
        """设置调试日志"""
        logger = logging.getLogger('sandbox_playground')
        logger.setLevel(logging.DEBUG)

        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s [%(levelname)s] %(message)s',
                datefmt='%H:%M:%S'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)

        return logger

    def _log(self, message: str):
        """调试日志输出"""
        if self.logger:
            self.logger.info(message)

    def _detect_compiler(self):
        """检测可用的编译器"""
        compilers = [
            {'cmd': ['g++'], 'name': 'GNU G++'},
            {'cmd': ['gcc', '-x', 'c++'], 'name': 'GNU GCC (C++ mode)'},
            {'cmd': ['/opt/tcsys/gcc-12.3.1.4/bin/g++'], 'name': 'Tencent G++ (LoongArch)'},
            {'cmd': ['/opt/tcsys/gcc-12.3.1.4/bin/gcc', '-x', 'c++'], 'name': 'Tencent GCC (LoongArch)'}
        ]

        for compiler in compilers:
            try:
                result = subprocess.run(
                    compiler['cmd'] + ['--version'],
                    capture_output=True, text=True, timeout=5
                )
                if result.returncode == 0:
                    self.compiler_info = compiler
                    self._log(f"检测到编译器: {compiler['name']}")
                    break
            except Exception as e:
                self._log(f"检测编译器 {compiler['name']} 失败: {e}")
                continue

    def _copy_required_libraries(self, executable_path: str, chroot_path: str) -> bool:
        """拷贝执行文件所需的动态库到 chroot 环境"""
        try:
            self._log(f"开始拷贝动态库依赖: {executable_path}")

            # 使用 ldd 获取动态库依赖
            result = subprocess.run(
                ['ldd', executable_path],
                capture_output=True, text=True, timeout=10
            )

            if result.returncode != 0:
                self._log("ldd 命令执行失败，可能是静态链接的可执行文件")
                return True  # 静态链接文件不需要拷贝库

            # 解析 ldd 输出
            libraries_to_copy = []
            for line in result.stdout.strip().split('\n'):
                line = line.strip()
                if '=>' in line:
                    # 格式: libname.so => /path/to/lib (0x...)
                    parts = line.split(' => ')
                    if len(parts) >= 2:
                        lib_path = parts[1].split(' ')[0]
                        if lib_path.startswith('/') and os.path.exists(lib_path):
                            libraries_to_copy.append(lib_path)
                elif line.startswith('/') and '(0x' in line:
                    # 格式: /lib64/ld-linux-loongarch-lp64d.so.1 (0x...)
                    lib_path = line.split(' ')[0]
                    if os.path.exists(lib_path):
                        libraries_to_copy.append(lib_path)

            # 拷贝库文件
            for lib_path in libraries_to_copy:
                lib_path = os.path.realpath(lib_path)  # 解析符号链接

                # 目标路径保持原有的目录结构
                relative_path = lib_path.lstrip('/')
                dest_path = os.path.join(chroot_path, relative_path)
                dest_dir = os.path.dirname(dest_path)

                # 创建目录
                os.makedirs(dest_dir, exist_ok=True)

                if not os.path.exists(dest_path):
                    self._log(f"拷贝库文件: {lib_path} -> {dest_path}")
                    shutil.copy2(lib_path, dest_path)

                    # 如果是动态链接器，确保权限正确
                    if 'ld-linux' in os.path.basename(lib_path):
                        os.chmod(dest_path, 0o755)

            self._log(f"动态库拷贝完成，共拷贝 {len(libraries_to_copy)} 个文件")
            return True

        except Exception as e:
            self._log(f"拷贝动态库失败: {e}")
            return False

    def _create_chroot_environment(self, executable_path: str) -> str:
        """创建 chroot 沙盒环境"""
        try:
            # 创建临时 chroot 目录
            chroot_dir = tempfile.mkdtemp(prefix='sandbox_chroot_')
            self._log(f"创建 chroot 环境: {chroot_dir}")

            # 创建基本目录结构
            essential_dirs = ['tmp', 'proc', 'dev', 'lib', 'lib64', 'usr/lib', 'usr/lib64']
            for dir_name in essential_dirs:
                os.makedirs(os.path.join(chroot_dir, dir_name), exist_ok=True)

            # 拷贝可执行文件到 chroot 环境
            exe_dest = os.path.join(chroot_dir, 'tmp', 'program')
            shutil.copy2(executable_path, exe_dest)
            os.chmod(exe_dest, 0o755)

            # 拷贝动态库依赖
            self._copy_required_libraries(executable_path, chroot_dir)

            return chroot_dir

        except Exception as e:
            self._log(f"创建 chroot 环境失败: {e}")
            raise

    async def _run_in_chroot(self, chroot_path: str, input_data: str = "", timeout: int = 5) -> Dict[str, Any]:
        """在 chroot 环境中运行程序"""
        try:
            self._log(f"在 chroot 环境中执行程序，超时设置: {timeout}s")

            # 使用 chroot 执行程序，设置资源限制
            cmd = [
                'chroot', chroot_path,
                '/tmp/program'
            ]

            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                preexec_fn=self._set_resource_limits  # 设置资源限制
            )

            try:
                stdout, stderr = await asyncio.wait_for(
                    proc.communicate(input_data.encode('utf-8') if input_data else None),
                    timeout=timeout
                )

                return {
                    'success': proc.returncode == 0,
                    'returncode': proc.returncode,
                    'stdout': stdout.decode('utf-8', errors='replace'),
                    'stderr': stderr.decode('utf-8', errors='replace')
                }

            except asyncio.TimeoutError:
                try:
                    proc.kill()
                    await proc.wait()
                except Exception:
                    pass
                return {
                    'success': False,
                    'returncode': -1,
                    'stdout': '',
                    'stderr': f'Execution timeout after {timeout} seconds'
                }

        except Exception as e:
            self._log(f"chroot 执行失败: {e}")
            return {
                'success': False,
                'returncode': -1,
                'stdout': '',
                'stderr': f'Chroot execution error: {e}'
            }

    def _set_resource_limits(self):
        """设置进程资源限制（在子进程中调用）"""
        try:
            # 限制CPU时间 (5秒)
            resource.setrlimit(resource.RLIMIT_CPU, (5, 5))

            # 限制内存使用 (64MB)
            max_memory = 64 * 1024 * 1024
            resource.setrlimit(resource.RLIMIT_AS, (max_memory, max_memory))

            # 限制文件大小 (1MB)
            max_file_size = 1 * 1024 * 1024
            resource.setrlimit(resource.RLIMIT_FSIZE, (max_file_size, max_file_size))

            # 限制文件描述符数量
            resource.setrlimit(resource.RLIMIT_NOFILE, (16, 16))

            # 禁止创建core dump文件
            resource.setrlimit(resource.RLIMIT_CORE, (0, 0))

        except Exception as e:
            # 资源限制设置失败不应阻止程序运行
            pass

    async def _compile_external(self, code: str) -> Dict[str, Any]:
        """外部编译（在主机环境中）"""
        if not self.compiler_info:
            return {
                'success': False,
                'error': 'No suitable compiler found'
            }

        try:
            with tempfile.TemporaryDirectory(prefix='compile_') as compile_dir:
                src_path = os.path.join(compile_dir, 'main.cpp')
                exe_path = os.path.join(compile_dir, 'main')

                # 写入源代码
                with open(src_path, 'w', encoding='utf-8') as f:
                    f.write(code)

                # 编译命令
                compile_cmd = self.compiler_info['cmd'] + [
                    src_path,
                    '-O2',
                    '-std=c++17',
                    '-o', exe_path
                ]

                self._log(f"执行编译命令: {' '.join(compile_cmd)}")

                # 执行编译
                proc = await asyncio.create_subprocess_exec(
                    *compile_cmd,
                    cwd=compile_dir,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )

                try:
                    stdout, stderr = await asyncio.wait_for(
                        proc.communicate(), timeout=15
                    )
                except asyncio.TimeoutError:
                    try:
                        proc.kill()
                    except Exception:
                        pass
                    return {
                        'success': False,
                        'error': 'Compile timeout'
                    }

                if proc.returncode != 0:
                    error_msg = stderr.decode('utf-8', errors='replace') or stdout.decode('utf-8', errors='replace')
                    return {
                        'success': False,
                        'error': f'Compile error:\n{error_msg}'
                    }

                # 检查可执行文件是否生成
                if not os.path.exists(exe_path):
                    return {
                        'success': False,
                        'error': 'Executable file not generated'
                    }

                self._log(f"编译成功: {exe_path}")
                return {
                    'success': True,
                    'executable_path': exe_path,
                    'method': 'external_compile'
                }

        except Exception as e:
            return {
                'success': False,
                'error': f'Compile exception: {e}'
            }

    async def run_code_secure(self, code: CodeContent, input_data: str = "", timeout: int = 5) -> str:
        """安全地运行代码（主要接口方法）"""
        if not self.is_linux or not self.sandbox_supported:
            # 回退到非沙盒模式（用于开发环境）
            self._log("沙盒不支持，使用标准模式运行")
            return await self._run_code_fallback(code, input_data)

        try:
            # 步骤1：外部编译
            self._log("开始外部编译...")
            compile_result = await self._compile_external(code)

            if not compile_result['success']:
                return compile_result['error']

            # 步骤2：创建沙盒环境
            self._log("创建沙盒环境...")
            chroot_path = self._create_chroot_environment(compile_result['executable_path'])

            try:
                # 步骤3：在沙盒中执行
                self._log("在沙盒中执行程序...")
                run_result = await self._run_in_chroot(chroot_path, input_data, timeout)

                if run_result['success']:
                    return run_result['stdout']
                else:
                    error_msg = run_result['stderr'] or f"Process exited with code {run_result['returncode']}"
                    return f"Runtime Error: {error_msg}"

            finally:
                # 清理 chroot 环境
                try:
                    shutil.rmtree(chroot_path)
                    self._log(f"清理沙盒环境: {chroot_path}")
                except Exception as e:
                    self._log(f"清理沙盒环境失败: {e}")

        except Exception as e:
            self._log(f"沙盒执行异常: {e}")
            return f"Sandbox Error: {e}"

    async def _run_code_fallback(self, code: CodeContent, input_data: str) -> str:
        """回退方案：标准环境运行（与原 Playground 兼容）"""
        try:
            with tempfile.TemporaryDirectory(prefix="playground_fallback_") as tmpdir:
                tmp = Path(tmpdir)
                src_path = tmp / "main.cpp"
                exe_path = tmp / "main.exe" if os.name == "nt" else tmp / "main"

                # 写入源代码
                src_path.write_text(code, encoding="utf-8")

                # 选择编译器
                if self.compiler_info:
                    compiler_cmd = self.compiler_info['cmd']
                else:
                    # 默认尝试 g++
                    compiler_cmd = ['g++']

                # 编译
                compile_proc = await asyncio.create_subprocess_exec(
                    *compiler_cmd,
                    str(src_path),
                    "-O2", "-std=c++17", "-o", str(exe_path),
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
                        run_proc.communicate(input_data.encode("utf-8") if input_data else None),
                        timeout=5,
                    )
                except asyncio.TimeoutError:
                    try:
                        run_proc.kill()
                    except Exception:
                        pass
                    return "Runtime Timeout"

                if run_proc.returncode != 0:
                    err = r_stderr.decode("utf-8", errors="replace")
                    out = r_stdout.decode("utf-8", errors="replace")
                    return (err or out) or f"Process exited with code {run_proc.returncode}"

                return r_stdout.decode("utf-8", errors="replace")

        except Exception as e:
            return f"Runner Error: {e}"

    # 兼容原有接口
    @staticmethod
    async def run_code(code: CodeContent, input_data: str, language: CodeLanguage) -> str:
        """静态方法接口（兼容原有代码）"""
        if language != CodeLanguage.C_CPP:
            return "Unsupported language: only c_cpp is available for now."

        # 创建沙盒实例并运行
        sandbox = SandboxPlayground(debug=False)
        return await sandbox.run_code_secure(code, input_data)

    @staticmethod
    async def judge_code(code: CodeContent, testSample: TestSampleCreate) -> JudgeResult:
        """批量测试接口（兼容原有代码）"""
        try:
            score = 0
            testRealOutput: List[MdCodeContent] = []
            sandbox = SandboxPlayground(debug=False)

            for i in range(len(testSample.input)):
                output = await sandbox.run_code_secure(
                    code=code,
                    input_data=testSample.input[i]
                )
                testRealOutput.append(output)

                if output.strip() == testSample.expectOutput[i].strip():
                    score += 1

            final_score = int(score / len(testSample.input) * 100)
            return JudgeResult(score=final_score, testRealOutput=testRealOutput)

        except Exception as e:
            return JudgeResult(
                score=0,
                testRealOutput=['' for i in range(len(testSample.input))]
            )


# 向后兼容别名
Playground = SandboxPlayground
