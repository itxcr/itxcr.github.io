import time
from selenium import webdriver
from lxml import etree

# 基础演示
# PATH = 'D:\softwares\chromedriver.exe'
# driver = webdriver.Chrome(PATH)
# driver.get('https://tj.lianjia.com/ershoufang/jinnan/')
# total_nums = driver.find_element_by_xpath('//*[@id="content"]/div[1]/div[2]/h2/span')
# print(total_nums.text)
# driver.quit()

# 大量数据演示
city_url = 'https://tj.lianjia.com/ershoufang'
PATH = 'D:\softwares\chromedriver.exe'
driver = webdriver.Chrome(PATH)


# 获取具体位置的 url
def get_locate_url():
    range_urls = {}
    driver.get(city_url)
    html = driver.page_source
    selector = etree.HTML(html)
    for i in range(0, 19):
        a_href = str(selector.xpath('/html/body/div[3]/div/div[1]/dl[2]/dd/div[1]/div/a[' + str(i + 1) + ']/@href')[0])
        a_name = str(selector.xpath('/html/body/div[3]/div/div[1]/dl[2]/dd/div[1]/div/a[' + str(i + 1) + ']/text()')[0])
        range_url = 'https://tj.lianjia.com' + a_href
        range_urls[a_name] = range_url
    return range_urls


# 获取分条件查找的 url
def get_locate_detail_url():
    range_urls = get_locate_url()
    range_price_urls = {}
    for key in range_urls:
        range_url = range_urls[key]
        part_range_price_url = []
        total_urls = []
        for i in range(1, 7):
            range_price_url = range_url + 'l' + str(i)
            part_range_price_url.append(range_price_url)
        for i in part_range_price_url:
            for j in range(1, 8):
                range_price_url = i + 'p' + str(j)
                total_urls.append(range_price_url)
        range_price_urls[key] = total_urls
    return range_price_urls


# 获取分页详情
def get_page_url():
    locate_detail_url = get_locate_detail_url()
    total_urls = []
    for key in locate_detail_url:
        locate_detail_urls = locate_detail_url[key]
        for url in locate_detail_urls:
            # 获取每一页有多少数据
            driver.get(url)
            # 等待资源加载完成
            time.sleep(2)
            html = driver.page_source
            selector = etree.HTML(html)
            house_nums = int(selector.xpath('//*[@id="content"]/div[1]/div[2]/h2/span/text()')[0])
            # 借助 python 整数类型特性
            # 每页最多 30 条
            # 如果取余为0 说明数据刚好够每页30条
            # 如果余数不为0 说明末尾页数据不足30 整体页数要 + 1
            yushu = house_nums % 30
            if yushu == 0:
                page_size = int(house_nums / 30)
            else:
                page_size = int(house_nums / 30) + 1
            print('数据量' + str(house_nums), '分页数' + str(page_size))
            for i in range(0, page_size):
                if i == 0:
                    last_url = url
                else:
                    # 'https://tj.lianjia.com/ershoufang/heping/l1p1'
                    # 分割结果 ['https:', '', 'tj.lianjia.com', 'ershoufang', 'heping', 'l1p1']
                    split_url = url.split('/')
                    url_detail_search = split_url[5]
                    # 字符串替换 完成最终目标 url 的拼接
                    last_url = url.replace(url_detail_search, 'pg' + str(i + 1) + url_detail_search)
                print(last_url)
                total_urls.append(last_url)
    driver.quit()
    return total_urls


# 模拟获取 total_urls
def get_detail_urls():
    # total_urls = get_page_url()
    total_urls = ['https://tj.lianjia.com/ershoufang/heping/l1p1']
    all_details = []
    for url in total_urls:
        driver.get(url)
        time.sleep(2)
        html = driver.page_source
        selector = etree.HTML(html)
        for i in range(0, 30):
            try:
                # 数据量超过能爬到的数量就会报错
                # 报错即跳出循环读取下一页数据
                final_url = selector.xpath('//*[@id="content"]/div[1]/ul/li[' + str(i + 1) + ']/div[1]/div[1]/a/@href')[
                    0]
                all_details.append(final_url)
            except Exception:
                break
    return all_details


# 获取详细信息
def get_detail_info():
    detail_urls = get_detail_urls()
    all_details = []
    for url in detail_urls:
        driver.get(url)
        time.sleep(2)
        html = driver.page_source
        selector = etree.HTML(html)
        total_price = selector.xpath('//*[@class="total"]/text()')[0]
        unit_price = selector.xpath('//*[@class="unitPriceValue"]/text()')[0]
        apartment_name = selector.xpath('//*[@class="communityName"]/a[1]/text()')[0]
        range_area = selector.xpath('//*[@class="info"]/a[2]/text()')[0]
        all_details.append({'total_price': total_price, 'unit_price': unit_price, 'apartment_name': apartment_name,
                            'range_area': range_area})
    driver.quit()
    return all_details


# 获取具体位置
# print(get_locate_url())

# 获取增加条件查找的
# print(get_locate_detail_url())

# 获取分页详情 数据量较大 不做过多等待
# print(get_page_url())

# 模拟获取 total_urls
# print(get_detail_urls())

# 获取详细信息
print(get_detail_info())
