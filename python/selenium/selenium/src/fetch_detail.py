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


# 爬取详细信息
def get_house_detail():
    # data = xlrd.open_workbook('')
    # table = data.sheet_by_name('Sheet1')
    # 获取行数
    # row_count = table.nrows
    # 启动一个driver
    driver = get_chromedriver()
    f = open('test111.txt', 'w', encoding='utf-8')
    # for i in range(0, row_count):
    #     area_name = table.row_values(i)[0]
    #     area_url = table.row_values(i)[1]
    try:
        # driver.get(area_url)
        driver.get('https://tj.lianjia.com/ershoufang/101109834215.html')
    except Exception:
        # driver.get(area_url)
        driver.get('https://tj.lianjia.com/ershoufang/101109834215.html')
    html = driver.page_source
    selector = etree.HTML(html)
    # try:
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
    transaction_ownership = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[2]/span[2]/text()')[0]).strip()
    # 3上次交易
    last_transaction = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[3]/span[2]/text()')[0]).strip()
    # 4房屋用途
    usage_of_houses = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[4]/span[2]/text()')[0]).strip()
    # 5房屋年限
    years_of_housing = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[5]/span[2]/text()')[0]).strip()
    # 6产权所属
    property_rights = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[6]/span[2]/text()')[0]).strip()
    # 7抵押信息
    mortgage_information = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[7]/span[2]/text()')[0]).strip()
    # 8房本备件
    room_spare_parts = str(selector.xpath('//*[@class="transaction"]/div[2]/ul/li[8]/span[2]/text()')[0]).strip()
    f.write("%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s" % (
        total_price, unit_price, community_name, locate_area, lon, lat,
        house_type, house_floor, house_construction_area,  house_structure, house_inside_area,
        house_building_type, house_facing, building_structure, renovation_condition, elevator_ratio,
        heating_method, equipped_with_elevator, listing_time, transaction_ownership,
        last_transaction, usage_of_houses, years_of_housing, property_rights, mortgage_information,
        room_spare_parts
    ))
    f.close()


# selector.xpath('//*[@class="transaction"]/div[2]/ul/li[1]/span[2]/text()')
# except Exception:
#     continue

# f.write('\n')
# print(str(i + 1))


# f.close()
# print('OK')

get_house_detail()
