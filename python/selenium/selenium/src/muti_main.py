from lxml import etree
import time
from selenium import webdriver
import pymongo
import re


class Lianjia:
    def __init__(self):
        self.details = None
        self.details_urls_err = None
        self.detail_urls = None
        self.all_urls_zero = None
        self.all_urls = None
        self.client = None
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('–disable-infobars')
        chrome_options.add_argument("--disable-extensions")
        # chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument("--disable-software-rasterizer")
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--ignore-certificate-errors')
        chrome_options.add_argument('--allow-running-insecure-content')
        chrome_options.add_argument("blink-settings=imagesEnabled=false")
        chrome_options.add_argument("--hide-scrollbars")
        chrome_options.add_argument("--disable-javascript")
        chrome_options.add_argument("--disable-popup-blocking")
        chrome_options.add_argument("--log-level=3")
        chrome_options.add_argument("--disable-cache")
        driver_path = 'D:\softwares\chromedriver.exe'
        self.driver = webdriver.Chrome(executable_path=driver_path, chrome_options=chrome_options)

    def get_detail_urls(self, total_detail_urls):
        print('开始获取详细url', total_detail_urls)
        self.driver.quit()

    def get_page_urls(self, condition_urls):
        exist_urls = []
        col_data = list(self.all_urls.find({}, {'url': 1, '_id': 0}))
        no_col_data = list(self.all_urls_zero.find({}, {'url': 1, '_id': 0}))
        for i in col_data:
            exist_urls.append(i['url'])
        for i in no_col_data:
            exist_urls.append(i['url'])
        total_detail_urls = col_data
        print(len(exist_urls))
        count = 0
        for key in condition_urls:
            count += 1
            condition_url = condition_urls[key]
            print('当前需搜索的个数', len(condition_url))
            condition_url = list(set(condition_url).difference(set(exist_urls)))
            print('排除掉数据库中已存在数据后剩余个数', len(condition_url))
            print('已循环', count)
            if len(condition_url) == 0:
                continue
            for url in condition_url:
                try:
                    self.driver.get(url)
                except Exception:
                    self.driver.get(url)
                time.sleep(1)
                html = self.driver.page_source
                selector = etree.HTML(html)
                try:
                    house_count = int(selector.xpath('//*[@id="content"]/div[1]/div[2]/h2/span/text()')[0])
                    if house_count == 0:
                        self.all_urls_zero.insert_one({'area_name': key, 'url': url})
                        print('中断跳出')
                        continue
                except Exception:
                    continue
                nums = house_count % 30
                if nums == 0:
                    page_count = int(house_count / 30)
                else:
                    page_count = int(house_count / 30) + 1
                print('数据量:' + str(house_count), '页数' + str(page_count))
                for i in range(0, page_count):
                    if i == 0:
                        page_url = url
                    else:
                        split_url = url.split('/')
                        condition = split_url[5]
                        page_url = url.replace(condition, 'pg' + str(i + 1) + condition)
                    try:
                        self.all_urls.insert_one({'area_name': key, 'url': page_url})
                        total_detail_urls.append(page_url)
                        print(page_url)
                    except Exception:
                        continue
        print(total_detail_urls)
        self.get_detail_urls(total_detail_urls)

    def get_condition_urls(self, range_urls):
        condition_urls = {}
        for key in range_urls:
            style_urls = []
            part_range_price_url = []
            total_urls = []
            for i in range(1, 4):
                style_urls.append(range_urls[key] + 'bt' + str(i))
            for i in style_urls:
                for j in range(1, 7):
                    part_range_price_url.append(i + 'l' + str(j))
            for i in part_range_price_url:
                for j in range(1, 8):
                    total_urls.append(i + 'p' + str(j))
            condition_urls[key] = total_urls
        self.get_page_urls(condition_urls)

    def get_range_url(self, base_url):
        self.driver.get(base_url)
        time.sleep(1)
        html = self.driver.page_source
        selector = etree.HTML(html)
        a_href = selector.xpath('/html/body/div[3]/div/div[1]/dl[2]/dd/div[1]/div/a/@href')
        range_name = selector.xpath('/html/body/div[3]/div/div[1]/dl[2]/dd/div[1]/div/a/text()')
        range_urls = {}
        for i in range(len(a_href)):
            range_urls[range_name[i]] = 'https://tj.lianjia.com' + str(a_href[i])
        self.get_condition_urls(range_urls)

    def run(self):
        self.mongo_client()
        city_url = 'https://tj.lianjia.com/ershoufang'
        self.get_range_url(city_url)

    def mongo_client(self):
        user_name = 'xcr01'
        user_pwd = 'dagongren'
        host = 'www.atlantide.top'
        port = 60001
        db_name = 'dagongren'
        self.client = pymongo.MongoClient(
            "mongodb://{username}:{password}@{host}:{port}/{db_name}".format(username=user_name, password=user_pwd,
                                                                             host=host,
                                                                             port=port,
                                                                             db_name=db_name))
        db = self.client['dagongren']
        self.all_urls = db['multi_all_urls']
        self.all_urls_zero = db['multi_all_urls_zero']
        self.detail_urls = db['multi_detail_urls']
        self.details_urls_err = db['multi_details_urls_err']
        self.details = db['multi_details']


if __name__ == '__main__':
    lj = Lianjia()
    lj.run()
