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
my_details = mydb['tianjin_detail_urls']
details = mydb['tianjin_details']


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


# 爬取详细信息
def get_house_detail():
    url_datas = list(my_details.find({}, {'url': 1, '_id': 0}))
    driver = get_chromedriver()
    for i in url_datas:
        detail_url = i['url']
        try:
            driver.get(detail_url)
        except Exception:
            driver.get(detail_url)
        time.sleep(1)
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
                'total_price':total_price,
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
            continue
    driver.quit()
    client.close()


get_house_detail()
