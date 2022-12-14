import unittest
from flask import current_app
from app import create_app, db
from tests import TestConfig


class BasicsTestCase(unittest.TestCase):
    def setUp(self) -> None:
        """初始化测试"""
        self.app = create_app(TestConfig)  # 创建Flask应用
        self.app_context = self.app.app_context()  # 激活Flask上下文
        self.app_context.push()
        db.create_all()  # 通过SQLAlchemy来使用SQLite内存数据库，db.create_all()快速创建所有的数据库表

    def tearDown(self) -> None:
        """每个测试结束执行"""
        db.session.remove()
        db.drop_all()  # 删除所有数据表
        self.app_context.pop()  # 退出Flask应用上下文

    def test_app_exists(self):
        self.assertFalse(current_app is None)

    def test_app_is_testing(self):
        self.assertTrue(current_app.config['TESTING'])
