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
    # 控制是否显示webdriver程序狂
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
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

print(get_range_url())