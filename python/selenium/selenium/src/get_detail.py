import xlrd
import xlwt
from lxml import etree
import re
import time
from selenium import webdriver


def get_chromedriver():
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('–disable-infobars')
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("--no-first-run")
    chrome_options.add_argument('blink-settings=imagesEnabled=false')
    chrome_options.add_argument('page_load_strategy=none')
    driver_path = 'D:\softwares\chromedriver.exe'
    return webdriver.Chrome(executable_path=driver_path, chrome_options=chrome_options)


# 获取每一个房源详情页的url
def get_final_urls():
    # 读取excel文件
    data = xlrd.open_workbook('天津市房产信息.xls')
    # 通过索引顺序获取表
    table = data.sheet_by_name('Sheet1')
    # print(table.row_values(0)[1])
    # 获取行数
    row_count = table.nrows
    driver = get_chromedriver()
    # 创建workboook
    workbook = xlwt.Workbook(encoding='utf-8')
    # 创建工作表
    worksheet = workbook.add_sheet('Sheet1')
    count = 0
    for i in range(0, row_count):
        area_name = table.row_values(i)[0]
        area_url = table.row_values(i)[1]
        try:
            driver.get(area_url)
        except Exception:
            driver.get(area_url)
        # 获取房源详情页面
        html = driver.page_source
        # 解析详情页
        selector = etree.HTML(html)
        for j in range(0, 30):
            try:
                final_url = selector.xpath('//*[@id="content"]/div[1]/ul/li[' + str(j + 1) + ']/a/@href')
            except Exception:
                break
            if len(final_url) == 0:
                continue
            worksheet.write(count, 0, area_name)
            worksheet.write(count, 1, final_url[0])
            count += 1
            print(area_name, final_url[0], count)
    driver.quit()
    workbook.save('小区详情.xls')
    print('小区总数' + str(count))


get_final_urls()
