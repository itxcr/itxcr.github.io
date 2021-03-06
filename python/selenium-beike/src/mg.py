from lxml import etree
import time
from selenium import webdriver
import pymongo
import re
import random
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
mycol = mydb['bk_tj_all_urls']
nocol = mydb['bk_tj_all_urls_err']
my_details = mydb['bk_tj_detail_urls']
details = mydb['bk_tj_details']
bk_details_err = mydb['bk_tj_details_none']
city_url = 'https://tj.ke.com/ershoufang/'


def get_chromedriver():
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('–disable-infobars')
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument('--headless')
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
    return webdriver.Chrome(executable_path=driver_path, chrome_options=chrome_options)


def get_range_url():
    range_urls = {}
    driver = get_chromedriver()
    driver.get(city_url)
    html = driver.page_source
    selector = etree.HTML(html)
    # 天津显示19个不同区域
    for i in range(0, 19):
        a_href = str(
            selector.xpath('//*[@id="beike"]/div[1]/div[3]/div[1]/dl[2]/dd/div[1]/div[1]/a[' + str(i + 1) + ']/@href')[
                0])
        range_name = str(
            selector.xpath('//*[@id="beike"]/div[1]/div[3]/div[1]/dl[2]/dd/div[1]/div[1]/a[' + str(i + 1) + ']/text()')[
                0])
        range_url = 'https://tj.ke.com' + a_href
        range_urls[range_name] = range_url
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
        print('当前', count)
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
                house_count = selector.xpath('//*[@id="beike"]/div[1]/div[4]/div[1]/div[2]/div[1]/h2/span/text()')[0]
                if int(house_count) == 0:
                    nocol.insert_one({'area_name': key, 'url': part_range_price_url})
                    print('当前链接房产数据为0，中断跳出')
                    continue
            except Exception:
                continue
            print('当前链接数据量:' + str(house_count))
            nums = int(house_count) % 30
            if nums == 0:
                page_count = int(int(house_count) / 30)
            else:
                page_count = int(int(house_count) / 30) + 1
            # 构造不同页码的URL
            print('当前链接可拼接页数:' + str(page_count))
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
        detail_url = ''
        for j in range(0, 31):
            try:
                detail_url = selector.xpath(
                    '//*[@id="beike"]/div[1]/div[4]/div[1]/div[4]/ul/li[' + str(j + 1) + '][@class="clear"]/a/@href')[0]
                detail_title = selector.xpath('//*[@id="beike"]/div[1]/div[4]/div[1]/div[4]/ul/li[' + str(
                    j + 1) + '][@class="clear"]/div/div[1]/a/text()')[0]
                my_details.insert_one({'title': detail_title, 'url': detail_url})
                print('成功:', detail_title, detail_url)
            except Exception:
                print('已存在或者拼接错误:' + str(j + 1), detail_url)
                continue
    driver.quit()


def get_house_detail():
    url_datas = list(my_details.find({}, {'url': 1, '_id': 0}))
    exist_details = list(details.find({}, {'url_id': 1, '_id': 0}))
    all_urls = []
    exist_urls = []
    for i in url_datas:
        all_urls.append(i['url'])
    print(len(all_urls))
    for i in exist_details:
        exist_urls.append('https://tj.ke.com/ershoufang/' + str(i['url_id']) + '.html')
    all_urls = list(set(all_urls).difference(set(exist_urls)))
    print(len(all_urls))
    driver = get_chromedriver()
    for i in all_urls:
        detail_url = i
        try:
            driver.get(detail_url)
        except Exception:
            driver.get(detail_url)
        a = random.random()
        print(a)
        time.sleep(a)
        html = driver.page_source
        selector = etree.HTML(html)
        url_id = detail_url.split('.')[2].split('/')[2]
        house_type = ''
        house_floor = ''
        rent_area = ''
        house_construction_area = ''
        house_structure = ''
        inside_area = ''
        house_building_type = ''
        house_facing = ''
        building_structure = ''
        renovation_condition = ''
        elevator_ratio = ''
        heating_method = ''
        equipped_with_elevator = ''
        type_of_water = ''
        type_of_electricity = ''
        gas_price = ''
        listing_time = ''
        transaction_ownership = ''
        last_transaction = ''
        usage_of_houses = ''
        years_of_housing = ''
        property_rights = ''
        mortgage_information = ''
        room_spare_parts = ''
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
            try:
                txt = selector.xpath('//*[@id="beike"]/script[5]/text()')[0]
                pattern = re.compile("resblockPosition: '" + "(.*?)" + "',", re.S)
                pos = pattern.findall(txt)[0]
                lon = pos.split(',')[0]
                lat = pos.split(',')[1]
            except Exception:
                lon = ''
                lat = ''
            lists = selector.xpath('//*[@id="introduction"]/div/div/div[1]/div[2]/ul/li/span/text()')
            lists_inner = selector.xpath('//*[@id="introduction"]/div/div/div[1]/div[2]/ul/li/text()')
            trade_list = selector.xpath('//*[@id="introduction"]/div/div/div[2]/div[2]/ul/li/span[1]/text()')
            trade_list_inner = selector.xpath('//*[@id="introduction"]/div/div/div[2]/div[2]/ul/li/text()')
            for k in range(0, len(lists)):
                # 1 房屋户型
                if lists[k] == '房屋户型':
                    house_type = str(lists_inner[k]).strip()
                # 2 所在楼层
                if lists[k] == '所在楼层':
                    house_floor = str(lists_inner[k]).strip()
                # 3 计租面积
                if lists[k] == '计租面积':
                    rent_area = str(lists_inner[k]).strip()
                # 4 建筑面积
                if lists[k] == '建筑面积':
                    house_construction_area = str(lists_inner[k]).strip()
                # 5 户型结构
                if lists[k] == '户型结构':
                    house_structure = str(lists_inner[k]).strip()
                # 6 套内面积
                if lists[k] == '套内面积':
                    inside_area = str(lists_inner[k]).strip()
                # 7 建筑类型
                if lists[k] == '建筑类型':
                    house_building_type = str(lists_inner[k]).strip()
                # 8 房屋朝向
                if lists[k] == '房屋朝向':
                    house_facing = str(lists_inner[k]).strip()
                # 9 建筑结构
                if lists[k] == '建筑结构':
                    building_structure = str(lists_inner[k]).strip()
                # 10 装修情况
                if lists[k] == '装修情况':
                    renovation_condition = str(lists_inner[k]).strip()
                # 11 梯户比例
                if lists[k] == '梯户比例':
                    elevator_ratio = str(lists_inner[k]).strip()
                # 12 供暖方式
                if lists[k] == '供暖方式':
                    heating_method = str(lists_inner[k]).strip()
                # 13 配备电梯
                if lists[k] == '配备电梯':
                    equipped_with_elevator = str(lists_inner[k]).strip()
                # 14 用水类型
                if lists[k] == '用水类型':
                    type_of_water = str(lists_inner[k]).strip()
                # 15 用电类型
                if lists[k] == '用电类型':
                    type_of_electricity = str(lists_inner[k]).strip()
                # 16 燃气价格
                if lists[k] == '燃气价格':
                    gas_price = str(lists_inner[k]).strip()
            for m in range(0, len(trade_list)):
                # 1 挂牌时间
                if trade_list[m] == '挂牌时间':
                    listing_time = str(trade_list_inner[m]).strip()
                # 2 交易权属
                if trade_list[m] == '交易权属':
                    transaction_ownership = str(trade_list_inner[m]).strip()
                # 3 上次交易
                if trade_list[m] == '上次交易':
                    last_transaction = str(trade_list_inner[m]).strip()
                # 4 房屋用途
                if trade_list[m] == '房屋用途':
                    usage_of_houses = str(trade_list_inner[m]).strip()
                # 5 房屋年限
                if trade_list[m] == '房屋年限':
                    years_of_housing = str(trade_list_inner[m]).strip()
                # 6 产权所属
                if trade_list[m] == '产权所属':
                    property_rights = str(trade_list_inner[m]).strip()
                # 7 抵押信息
                if trade_list[m] == '抵押信息':
                    mortgage_information = str(
                        selector.xpath('//*[@id="introduction"]/div/div/div[2]/div[2]/ul/li[7]/span[2]/text()')[
                            0]).strip()
                # 8 房本备件
                if trade_list[m] == '房本备件':
                    room_spare_parts = str(
                        selector.xpath('//*[@id="introduction"]/div/div/div[2]/div[2]/ul/li[8]/text()')[0]).strip()
            details.insert_one({
                'catch_time': time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                'community_name': community_name,
                'locate_area': locate_area,
                'total_price': total_price,
                'unit_price': unit_price,
                'house_type': house_type,
                'house_floor': house_floor,
                'house_construction_area': house_construction_area,
                'inside_area': inside_area,
                'rent_area': rent_area,
                'house_structure': house_structure,
                'house_building_type': house_building_type,
                'house_facing': house_facing,
                'building_structure': building_structure,
                'renovation_condition': renovation_condition,
                'elevator_ratio': elevator_ratio,
                'heating_method': heating_method,
                'equipped_with_elevator': equipped_with_elevator,
                'type_of_water': type_of_water,
                'type_of_electricity': type_of_electricity,
                'gas_price': gas_price,
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
            print(total_price)
        except Exception:
            try:
                bk_details_err.insert_one({'url': detail_url})
            except Exception:
                print(detail_url, '已存在')
            continue
    driver.quit()
    client.close()
    print('抓取结束')


def main():
    # get_range_price_page_url()
    # get_final_urls()
    get_house_detail()


if __name__ == '__main__':
    main()
