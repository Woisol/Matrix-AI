"""
ORM 框架单元测试运行脚本
"""

import sys
import os
import asyncio
import subprocess
from pathlib import Path


def run_tests():
    """运行所有 ORM 测试"""
    # 设置测试路径
    test_dir = Path(__file__).parent
    
    print("🚀 开始运行 PostgreSQL ORM 框架测试套件")
    print("="*60)
    
    # 测试模块列表
    test_modules = [
        "test_base_model.py",
        "test_field.py", 
        "test_query_builder.py",
        "test_connection_pool.py",
        "test_transaction.py",
        "test_relationships.py",
        "test_batch_operations.py",
        "test_data_validation.py",
        "test_migration.py"
    ]
    
    # 检查测试文件是否存在
    missing_files = []
    for module in test_modules:
        test_file = test_dir / module
        if not test_file.exists():
            missing_files.append(module)
    
    if missing_files:
        print(f"❌ 缺少测试文件: {', '.join(missing_files)}")
        return False
    
    print(f"✅ 发现 {len(test_modules)} 个测试模块")
    print()
    
    # 运行测试配置检查
    print("🔧 检查测试环境...")
    try:
        # 检查 pytest 是否安装
        result = subprocess.run([sys.executable, "-m", "pytest", "--version"], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ pytest 未安装，请运行: pip install pytest pytest-asyncio")
            return False
        print(f"✅ pytest 版本: {result.stdout.strip()}")
        
        # 检查 asyncpg 是否安装
        try:
            import asyncpg
            print(f"✅ asyncpg 版本: {asyncpg.__version__}")
        except ImportError:
            print("❌ asyncpg 未安装，请运行: pip install asyncpg")
            return False
            
        # 检查 pydantic 是否安装
        try:
            import pydantic
            print(f"✅ pydantic 版本: {pydantic.VERSION}")
        except ImportError:
            print("❌ pydantic 未安装，请运行: pip install pydantic")
            return False
            
    except Exception as e:
        print(f"❌ 环境检查失败: {e}")
        return False
    
    print()
    
    # 运行完整测试套件
    print("🧪 运行完整测试套件...")
    cmd = [
        sys.executable, "-m", "pytest",
        str(test_dir),
        "-v",                    # 详细输出
        "--tb=short",           # 简短的错误回溯
        "--durations=10",       # 显示最慢的10个测试
        "--strict-markers",     # 严格标记模式
        "--disable-warnings",   # 禁用警告
        "-x"                    # 遇到第一个失败就停止
    ]
    
    try:
        result = subprocess.run(cmd, cwd=test_dir.parent.parent.parent)
        
        if result.returncode == 0:
            print()
            print("🎉 所有测试通过！")
            print("="*60)
            return True
        else:
            print()
            print("❌ 测试失败，请检查上述错误信息")
            print("="*60)
            return False
            
    except Exception as e:
        print(f"❌ 运行测试时出错: {e}")
        return False


def run_coverage_report():
    """运行测试覆盖率报告"""
    print("📊 生成测试覆盖率报告...")
    
    test_dir = Path(__file__).parent
    orm_module = test_dir.parent.parent / "utils" / "orm.py"
    
    # 检查 coverage 是否安装
    try:
        result = subprocess.run([sys.executable, "-m", "coverage", "--version"], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            print("⚠️  coverage 未安装，跳过覆盖率检查")
            print("   可运行 'pip install coverage' 安装")
            return True
    except Exception:
        print("⚠️  coverage 未安装，跳过覆盖率检查")
        return True
    
    # 运行覆盖率测试
    cmd = [
        sys.executable, "-m", "coverage", "run",
        "--source", str(orm_module.parent),
        "-m", "pytest", str(test_dir),
        "-v", "--tb=short"
    ]
    
    try:
        result = subprocess.run(cmd, cwd=test_dir.parent.parent.parent)
        
        if result.returncode == 0:
            # 生成覆盖率报告
            print()
            print("📈 覆盖率报告:")
            subprocess.run([sys.executable, "-m", "coverage", "report", "--show-missing"])
            
            # 生成 HTML 报告
            subprocess.run([sys.executable, "-m", "coverage", "html", "--directory", "htmlcov"])
            print(f"🌐 HTML 覆盖率报告已生成: {test_dir.parent.parent.parent}/htmlcov/index.html")
            
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ 生成覆盖率报告时出错: {e}")
        return False


def run_specific_test(test_module):
    """运行特定测试模块"""
    test_dir = Path(__file__).parent
    test_file = test_dir / test_module
    
    if not test_file.exists():
        print(f"❌ 测试文件不存在: {test_module}")
        return False
    
    print(f"🧪 运行测试模块: {test_module}")
    print("="*60)
    
    cmd = [
        sys.executable, "-m", "pytest",
        str(test_file),
        "-v", "--tb=long"
    ]
    
    try:
        result = subprocess.run(cmd, cwd=test_dir.parent.parent.parent)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ 运行测试时出错: {e}")
        return False


def main():
    """主函数"""
    if len(sys.argv) > 1:
        # 运行特定测试
        test_module = sys.argv[1]
        if not test_module.endswith('.py'):
            test_module += '.py'
        success = run_specific_test(test_module)
    else:
        # 运行所有测试
        success = run_tests()
        
        # 如果测试通过，生成覆盖率报告
        if success:
            run_coverage_report()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()