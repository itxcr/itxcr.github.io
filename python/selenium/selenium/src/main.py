import xlrd
import xlwt
from lxml import etree
import re
import time
from selenium import webdriver
import pymongo

user_name = 'xcr01'
user_pwd = 'dagongren'
host = 'www.atlantide.top'
port = 60001
db_name = 'dagongren'
client = pymongo.MongoClient(
    "mongodb://{username}:{password}@{host}:{port}/{db_name}".format(username=user_name, password=user_pwd, host=host,
                                                                     port=port,
                                                                     db_name=db_name))
mydb = client['dagongren']
mycol = mydb['tianjin_all_urls']
nocol = mydb['tianjin_all_urls_zero']

city_url = 'https://tj.lianjia.com/ershoufang'


# 实例化 chromedriver
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
    exist_urls = []
    col_data = list(mycol.find({}, {'url': 1, '_id': 0}))
    no_col_data = list(nocol.find({}, {'url': 1, '_id': 0}))
    for i in col_data:
        exist_urls.append(i['url'])
    for i in no_col_data:
        exist_urls.append(i['url'])
    for key in range_price_urls:
        try:
            driver = get_chromedriver()
        except Exception:
            driver = get_chromedriver()
        part_range_price_urls = range_price_urls[key]
        part_range_price_urls = list(set(part_range_price_urls).difference(set(exist_urls)))
        print(len(part_range_price_urls))
        for part_range_price_url in part_range_price_urls:
            # 请求URL获取该页面中房源的个数，计算有多少页
            try:
                driver.get(part_range_price_url)
            except Exception:
                driver.get(part_range_price_url)
            time.sleep(1)
            html = driver.page_source
            selector = etree.HTML(html)
            # 根据不同区不同售价url页面中的总房源数（每页30条，最后一页不足30条）计算有多少页
            try:
                house_count = selector.xpath('//*[@id="content"]/div[1]/div[2]/h2/span/text()')[0]
            except Exception:
                print('house_count没有元素，中断跳出')
                nocol.insert_one({'area_name': key, 'url': part_range_price_url})
                continue
            if int(house_count) == 0:
                try:
                    nocol.insert_one({'area_name': key, 'url': part_range_price_url})
                    print('中断跳出')
                except Exception:
                    continue
                continue
            print('数据量:' + str(house_count))
            nums = int(house_count) % 30
            if nums == 0:
                page_count = int(int(house_count) / 30)
            else:
                page_count = int(int(house_count) / 30) + 1
            # 构造不同页码的URL
            print('页数:' + str(page_count))
            for i in range(0, page_count):
                if i == 0:
                    range_price_page_url = part_range_price_url
                else:
                    list_url = part_range_price_url.split('/')
                    url_priceId = list_url[5]
                    range_price_page_url = part_range_price_url.replace(url_priceId, 'pg' + str(i + 1) + url_priceId)
                try:
                    mycol.insert_one({'area_name': key, 'url': range_price_page_url})
                    print(range_price_page_url)
                except Exception:
                    continue
                worksheet.write(count, 0, key)
                worksheet.write(count, 1, range_price_page_url)
                count += 1
        driver.quit()
    client.close()
    workbook.save('天津市所有区不同价格不同房型不同板型Url信息.xls')


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


get_range_price_page_url()
