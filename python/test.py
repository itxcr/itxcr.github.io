import pymysql
from faker import Faker

conn = pymysql.connect(host="127.0.0.1", port=3306, user="root", password="root", db="test",
                       charset="utf8")

cursor = conn.cursor()
sql1 = """drop table if exists faker_user"""
sql2 = """
create table faker_user(
pid int primary key auto_increment,
username varchar(20),
password varchar(20),
address varchar(35) 
)
"""
cursor.execute(sql1)
cursor.execute(sql2)
fake = Faker("zh-CN")
for i in range(10):
    sql = """insert into faker_user(username,password,address) 
    values('%s','%s','%s')""" % (fake.name(), fake.password(special_chars=False), fake.address())
    print('姓名:' + fake.name() + '|密码:' + fake.password(special_chars=False) + '|地址:' + fake.address())
    cursor.execute(sql)

conn.commit()
cursor.close()
conn.close()
