import asyncpg


class NoUnlistenConnection(asyncpg.Connection):
        """
        自定义 asyncpg 连接：覆盖 reset 以跳过 UNLISTEN。

        背景：部分 PostgreSQL 兼容实现（例如某些 openGauss 版本）尚不支持 LISTEN/UNLISTEN，
        而 asyncpg 在连接释放/重置时会执行 UNLISTEN * 清理监听，导致报错：
            "UNLISTEN statement is not yet supported"。

        解决：覆盖 reset() 为 no-op，避免向服务器发送 UNLISTEN，从而保证连接释放不报错。

        注意：这会跳过常规的连接状态重置（如 RESET/CLOSE/UNLISTEN 等），
        在严苛的多租户或复用场景中可能导致会话级别设置遗留。若需更严格控制，
        可根据后端能力在此实现最小重置集合，或提供开关按需启用。
        """

        async def reset(self, *, timeout: float | None = None) -> None:  # type: ignore[override]
                # 跳过 UNLISTEN 等不被支持的语句，但执行必要的会话重置
                try:
                    # 重置时区为 UTC，确保时区一致性
                    await self.execute("SET timezone = 'UTC'")
                    # 重置其他可能影响 datetime 处理的设置
                    await self.execute("SET datestyle = 'ISO, MDY'")
                    # 确保时区处理模式
                    await self.execute("SET TimeZone = 'UTC'")
                except Exception as e:
                    # 如果重置失败，记录但不抛出异常，保持兼容性
                    import logging
                    logging.warning(f"Failed to reset connection settings: {e}")
                return None
        

