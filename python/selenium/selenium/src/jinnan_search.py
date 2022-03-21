import xlrd
import xlwt
from lxml import etree
import re
import time
from selenium import webdriver

city_url = 'https://tj.lianjia.com/ershoufang'


# 实例化 chromedriver
def get_chromedriver():
    chrome_options = webdriver.ChromeOptions()
    # chrome_options.add_argument('–disable-infobars')
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("--no-first-run")
    chrome_options.add_argument('blink-settings=imagesEnabled=false')
    chrome_options.add_argument('page_load_strategy=none')
    driver_path = 'D:\softwares\chromedriver.exe'
    return webdriver.Chrome(executable_path=driver_path, chrome_options=chrome_options)


def get_range_url():
    # 声明 list 用于存储不同区的 url
    range_urls = {}
    driver = get_chromedriver()
    driver.get(city_url)
    html = driver.page_source
    selector = etree.HTML(html)
    a_href = str(selector.xpath('/html/body/div[3]/div/div[1]/dl[2]/dd/div[1]/div/a[10]/@href')[0])
    a_name = str(selector.xpath('/html/body/div[3]/div/div[1]/dl[2]/dd/div[1]/div/a[10]/text()')[0])
    range_url = 'https://tj.lianjia.com' + a_href
    range_urls[a_name] = range_url
    driver.quit()
    return range_urls


def get_range_price_url():
    range_urls = get_range_url()
    range_price_urls = {}
    for key in range_urls:
        range_url = range_urls[key]
        style_urls = []
        part_range_price_url = []
        total_urls = []
        for i in range(1, 4):
            range_price_url = range_url + 'bt' + str(i)
            style_urls.append(range_price_url)
        for i in style_urls:
            for j in range(1, 7):
                range_price_url = i + 'l' + str(j)
                part_range_price_url.append(range_price_url)
        for i in part_range_price_url:
            for j in range(1, 8):
                range_price_url = i + 'p' + str(j)
                total_urls.append(range_price_url)
        range_price_urls[key] = total_urls
    return range_price_urls


def get_range_price_page_url():
    range_price_urls = get_range_price_url()
    workbook = xlwt.Workbook(encoding='utf-8')
    worksheet = workbook.add_sheet('Sheet1')
    count = 0
    sum_nums = 0
    for key in range_price_urls:
        try:
            driver = get_chromedriver()
        except Exception:
            driver = get_chromedriver()
        part_range_price_urls = range_price_urls[key]
        for part_range_price_url in part_range_price_urls:
            # 请求URL获取该页面中房源的个数，计算有多少页
            try:
                driver.get(part_range_price_url)
            except Exception:
                driver.get(part_range_price_url)
            time.sleep(2)
            html = driver.page_source
            selector = etree.HTML(html)
            house_count = selector.xpath('//*[@id="content"]/div[1]/div[2]/h2/span/text()')
            if house_count[0] == '0':
                print('数据为0，中断跳出')
                continue
            print('未中断', '数据量:' + str(house_count[0]))
            sum_nums += int(house_count[0])
            nums = int(house_count[0]) % 30
            print('nums:' + str(nums))
            if nums == 0:
                page_count = int(int(house_count[0]) / 30)
            else:
                page_count = int(int(house_count[0]) / 30) + 1
            print('页数:' + str(page_count))
            for i in range(0, page_count):
                if i == 0:
                    range_price_page_url = part_range_price_url
                else:
                    list_url = part_range_price_url.split('/')
                    url_priceId = list_url[5]
                    range_price_page_url = part_range_price_url.replace(url_priceId, 'pg' + str(i + 1) + url_priceId)
                print(range_price_page_url)
                worksheet.write(count, 0, key)
                worksheet.write(count, 1, range_price_page_url)
                count += 1
        driver.quit()
    workbook.save('天津市津南区房产信息.xls')
    print('房产总数' + str(sum_nums))


def get_final_urls():
    # 读取excel文件
    data = xlrd.open_workbook('天津市津南区房产信息.xls')
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
                final_url = selector.xpath('//*[@id="content"]/div[1]/ul/li[' + str(j + 1) + ']/div[1]/div[1]/a/@href')[0]
            except Exception:
                break
            worksheet.write(count, 0, area_name)
            worksheet.write(count, 1, final_url[0])
            count += 1
            print(area_name, final_url[0], count)
    driver.quit()
    workbook.save('小区详情.xls')
    print('小区总数' + str(count))


get_final_urls()
