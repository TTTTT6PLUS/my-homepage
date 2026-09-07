# seed_demo.py —— 造"演示种子数据"的自定义管理命令
# 作用：云端 Render 的免费磁盘是"临时盘"，服务一重启数据就被清空。
#       所以每次部署后跑一次本命令：表是空的就补几条语录/名单，
#       让主人一打开线上主页就有内容可看（而不是一片空白）。
# 用法：python manage.py seed_demo

from django.core.management.base import BaseCommand
# ↑ 导入 Django 管理命令的基类：写一个继承它的类 = 造一条新命令
#   命令名 = 类名去掉 Command 后缀再小写 → 就是 seed_demo

from app.models import Quote, PoolName
# ↑ 导入要操作的两张表

# 想预置的内容清单（可按主人喜好随便加）
SEED_QUOTES = [
    ("Talk is cheap, show me the code", "Linus"),
    ("保持饥饿，保持愚蠢", "Steve Jobs"),
    ("代码如诗，重在简洁", "佚名"),
]
# ↑ 每条 = (语录正文, 作者)，和 models.py 的 Quote 字段一一对应

SEED_POOL = ["张三", "李四", "王五", "赵六"]
# ↑ 抽签名单的默认成员


class Command(BaseCommand):
    """往空表里塞演示数据（重复执行不会重复塞，天然幂等）。"""

    help = "往空表里塞演示数据（重复执行不会重复塞）"

    def handle(self, *args, **options):
        # 语录表是空的 → 才批量创建（避免部署两次就塞两遍）
        if Quote.objects.count() == 0:
            for text, author in SEED_QUOTES:
                Quote.objects.create(text=text, author=author)
            self.stdout.write(self.style.SUCCESS(f"已写入 {len(SEED_QUOTES)} 条语录"))
        else:
            self.stdout.write("语录表已有数据，跳过")

        # 名单表是空的 → 才批量创建
        if PoolName.objects.count() == 0:
            for name in SEED_POOL:
                PoolName.objects.create(name=name)
            self.stdout.write(self.style.SUCCESS(f"已写入 {len(SEED_POOL)} 个名单"))
        else:
            self.stdout.write("名单表已有数据，跳过")
