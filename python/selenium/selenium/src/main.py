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


# 获取不同区的URL，参数为城市二手房首页的URL
def get_range_url():
    # 声明 list 用于存储不同区的 url
    range_urls = {}
    driver = get_chromedriver()
    driver.get(city_url)
    html = driver.page_source
    selector = etree.HTML(html)
    # 天津显示19个不同区域
    for i in range(0, 19):
        a_href = str(
            selector.xpath('/html/body/div[3]/div/div[1]/dl[2]/dd/div[1]/div[1]/a[' + str(i + 1) + ']/@href')[0])
        range_name = str(
            selector.xpath('/html/body/div[3]/div/div[1]/dl[2]/dd/div[1]/div[1]/a[' + str(i + 1) + ']/text()')[0])
        range_url = 'https://tj.lianjia.com' + a_href
        range_urls[range_name] = range_url
    return range_urls


# 根据以获取不同城区的URL，获取不同区不同售价的URL
def get_range_price_url():
    # 获取不同地区的URL
    range_urls = get_range_url()
    # 声明字典用于存储不同区，不同售价的URL，key 为每个区名，value 为该区对应的8个售价url
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


# 根据已经获取的不同区不同售价的URL，获取不同区不同售价不同页的URL，将URL写入excel
def get_range_price_page_url():
    range_price_urls = get_range_price_url()
    # 创建 workbook
    workbook = xlwt.Workbook(encoding='utf-8')
    # 创建 表
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
            # time.sleep(2)
            html = driver.page_source
            selector = etree.HTML(html)
            # 根据不同区不同售价url页面中的总房源数（每页30条，最后一页不足30条）计算有多少页
            house_count = selector.xpath('//*[@id="content"]/div[1]/div[2]/h2/span/text()')
            if int(house_count[0]) == 0:
                print('数据为0，中断跳出')
                continue
            print('未中断', '数据量:' + str(house_count[0]))
            sum_nums += int(house_count[0])
            nums = int(house_count[0]) % 30
            if nums == 0:
                page_count = int(int(house_count[0]) / 30)
            else:
                page_count = int(int(house_count[0]) / 30) + 1
            # 构造不同页码的URL
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
    workbook.save('天津市房产信息.xls')
    print('房产总数' + str(sum_nums))


get_range_price_page_url()
