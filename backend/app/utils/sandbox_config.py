"""
沙盒配置管理
"""
import os
from typing import Dict, Any


class SandboxConfig:
    """沙盒配置管理类"""
    
    # 默认配置
    DEFAULT_CONFIG = {
        'SANDBOX_ENABLED': True,
        'SANDBOX_DEBUG': False,
        'SANDBOX_TIMEOUT': 5,
        'SANDBOX_MAX_MEMORY_MB': 64,
        'SANDBOX_MAX_CPU_TIME': 5,
        'SANDBOX_MAX_FILE_SIZE_MB': 1,
        'COMPILE_TIMEOUT': 15
    }
    
    @classmethod
    def load_config(cls) -> Dict[str, Any]:
        """加载配置，支持环境变量覆盖"""
        config = cls.DEFAULT_CONFIG.copy()
        
        # 从环境变量读取配置
        for key in config:
            env_value = os.getenv(key)
            if env_value is not None:
                # 转换数据类型
                if isinstance(config[key], bool):
                    config[key] = env_value.lower() in ('true', '1', 'yes', 'on')
                elif isinstance(config[key], int):
                    try:
                        config[key] = int(env_value)
                    except ValueError:
                        pass  # 保持默认值
                else:
                    config[key] = env_value
        
        return config
    
    @classmethod
    def get_sandbox_enabled(cls) -> bool:
        """获取沙盒是否启用"""
        return cls.load_config()['SANDBOX_ENABLED'] and os.name == 'posix'
    
    @classmethod
    def get_debug_enabled(cls) -> bool:
        """获取调试是否启用"""
        return cls.load_config()['SANDBOX_DEBUG']
    
    @classmethod
    def get_timeout(cls) -> int:
        """获取执行超时时间"""
        return cls.load_config()['SANDBOX_TIMEOUT']
    
    @classmethod
    def get_compile_timeout(cls) -> int:
        """获取编译超时时间"""
        return cls.load_config()['COMPILE_TIMEOUT']
    
    @classmethod
    def get_memory_limit_mb(cls) -> int:
        """获取内存限制（MB）"""
        return cls.load_config()['SANDBOX_MAX_MEMORY_MB']
    
    @classmethod
    def get_cpu_time_limit(cls) -> int:
        """获取CPU时间限制（秒）"""
        return cls.load_config()['SANDBOX_MAX_CPU_TIME']
    
    @classmethod
    def get_file_size_limit_mb(cls) -> int:
        """获取文件大小限制（MB）"""
        return cls.load_config()['SANDBOX_MAX_FILE_SIZE_MB']
