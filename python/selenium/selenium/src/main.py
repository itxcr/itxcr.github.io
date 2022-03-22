from lxml import etree
import time
from selenium import webdriver
import pymongo
import re

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
my_details = mydb['tianjin_detail_urls']
details = mydb['tianjin_details']
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
    exist_urls = []
    col_data = list(mycol.find({}, {'url': 1, '_id': 0}))
    no_col_data = list(nocol.find({}, {'url': 1, '_id': 0}))
    for i in col_data:
        exist_urls.append(i['url'])
    for i in no_col_data:
        exist_urls.append(i['url'])
    driver = get_chromedriver()
    count = 0
    for key in range_price_urls:
        count += 1
        part_range_price_urls = range_price_urls[key]
        print('当前需搜索的个数', len(part_range_price_urls), )
        part_range_price_urls = list(set(part_range_price_urls).difference(set(exist_urls)))
        print('排除掉数据库中已存在数据后剩余个数', len(part_range_price_urls))
        print('已循环', count)
        if len(part_range_price_urls) == 0:
            continue
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
                if int(house_count) == 0:
                    nocol.insert_one({'area_name': key, 'url': part_range_price_url})
                    print('中断跳出')
                    continue
            except Exception:
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
    driver.quit()
    print('结束')
    # client.close()


def get_final_urls():
    print('开始获取详细url')
    col_data = list(mycol.find({}, {'url': 1, '_id': 0}))
    driver = get_chromedriver()
    for i in col_data:
        area_url = i['url']
        try:
            driver.get(area_url)
        except Exception:
            driver.get(area_url)
        html = driver.page_source
        selector = etree.HTML(html)
        for j in range(0, 30):
            try:
                detail_url = selector.xpath('//*[@id="content"]/div[1]/ul/li[' + str(j + 1) + ']/div[1]/div[1]/a/@href')[0]
                detail_title = selector.xpath('//*[@id="content"]/div[1]/ul/li[' + str(j + 1) + ']/div[1]/div[1]/a/text()')[0]
                my_details.insert_one({'title': detail_title, 'url': detail_url})
                print('成功:', detail_title, detail_url)
            except Exception:
                print('失败:' + str(j + 1), detail_url)
                continue
    driver.quit()
    # client.close()


def get_house_detail():
    url_datas = list(my_details.find({}, {'url': 1, '_id': 0}))
    driver = get_chromedriver()
    for i in url_datas:
        detail_url = i['url']
        try:
            driver.get(detail_url)
        except Exception:
            driver.get(detail_url)
        # time.sleep(1)
        html = driver.page_source
        selector = etree.HTML(html)
        url_id = detail_url.split('.')[2].split('/')[2]
        try:
            # 获取总价
            total_price = selector.xpath('//*[@class="total"]/text()')[0]
            # 获取单价
            unit_price = selector.xpath('//*[@class="unitPriceValue"]/text()')[0]
            # 小区名称
            community_name = selector.xpath('//*[@class="communityName"]/a[1]/text()')[0]
            # 所在区域
            locate_area = selector.xpath('//*[@class="info"]/a[2]/text()')[0]
            # 通过正则表达式匹配获取经纬度信息
            pattern = re.compile("resblockPosition:'" + '(.*?)' + "',", re.S)
            pos = pattern.findall(html)[0]
            lon = pos.split(',')[0]
            lat = pos.split(',')[1]
            # 获取基本信息
            # 1房屋户型
            house_type = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[1]/text()')[0]).strip()
            # 2所在楼层
            house_floor = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[2]/text()')[0]).strip()
            # 3建筑面积
            house_construction_area = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[3]/text()')[0]).strip()
            # 4户型结构
            house_structure = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[4]/text()')[0]).strip()
            # 5套内面积
            house_inside_area = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[5]/text()')[0]).strip()
            # 6建筑类型
            house_building_type = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[6]/text()')[0]).strip()
            # 7房屋朝向
            house_facing = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[7]/text()')[0]).strip()
            # 8建筑结构
            building_structure = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[8]/text()')[0]).strip()
            # 9装修情况
            renovation_condition = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[9]/text()')[0]).strip()
            # 10梯户比例
            elevator_ratio = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[10]/text()')[0]).strip()
            # 11供暖方式
            heating_method = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[11]/text()')[0]).strip()
            # 12配备电梯
            equipped_with_elevator = str(selector.xpath('//*[@class="base"]/div[2]/ul/li[12]/text()')[0]).strip()
            # 获取交易属性
            # 1挂牌时间
            listing_time = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[1]/span[2]/text()')[0]).strip()
            # 2交易权属
            transaction_ownership = str(
                selector.xpath('//*[@class="transaction"]/div[2]/ul/li[2]/span[2]/text()')[0]).strip()
            # 3上次交易
            last_transaction = str(
                selector.xpath('//*[@class="transaction"]/div[2]/ul/li[3]/span[2]/text()')[0]).strip()
            # 4房屋用途
            usage_of_houses = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[4]/span[2]/text()')[0]).strip()
            # 5房屋年限
            years_of_housing = str(
                selector.xpath('//*[@class="transaction"]/div[2]/ul/li[5]/span[2]/text()')[0]).strip()
            # 6产权所属
            property_rights = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[6]/span[2]/text()')[0]).strip()
            # 7抵押信息
            mortgage_information = str(
                selector.xpath('//*[@class="transaction"]/div[2]/ul/li[7]/span[2]/text()')[0]).strip()
            # 8房本备件
            room_spare_parts = str(
                selector.xpath('//*[@class="transaction"]/div[2]/ul/li[8]/span[2]/text()')[0]).strip()
            details.insert_one({
                'community_name': community_name,
                'locate_area': locate_area,
                'total_price': total_price,
                'unit_price': unit_price,
                'house_type': house_type,
                'house_floor': house_floor,
                'house_construction_area': house_construction_area,
                'house_structure': house_structure,
                'house_inside_area': house_inside_area,
                'house_building_type': house_building_type,
                'house_facing': house_facing,
                'building_structure': building_structure,
                'renovation_condition': renovation_condition,
                'elevator_ratio': elevator_ratio,
                'heating_method': heating_method,
                'equipped_with_elevator': equipped_with_elevator,
                'listing_time': listing_time,
                'transaction_ownership': transaction_ownership,
                'last_transaction': last_transaction,
                'usage_of_houses': usage_of_houses,
                'years_of_housing': years_of_housing,
                'property_rights': property_rights,
                'mortgage_information': mortgage_information,
                'room_spare_parts': room_spare_parts,
                'lon': lon,
                'lat': lat,
                'url_id': url_id
            })
            print(community_name, locate_area, total_price, unit_price, house_type,
                  house_floor, house_construction_area, house_structure, house_inside_area,
                  house_building_type, house_facing,
                  building_structure, renovation_condition,
                  elevator_ratio, heating_method,
                  equipped_with_elevator, listing_time,
                  transaction_ownership, last_transaction,
                  usage_of_houses, years_of_housing,
                  property_rights, mortgage_information,
                  room_spare_parts, lon, lat, url_id)
        except Exception:
            print('失败:', detail_url)
            continue
    driver.quit()
    client.close()


def main():
    get_range_price_page_url()
    get_final_urls()
    get_house_detail()


if __name__ == '__main__':
    main()
