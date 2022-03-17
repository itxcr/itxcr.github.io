import xlrd
import xlwt
from lxml import etree
from selenium import webdriver
import re
import time

city_url = 'https://qd.lianjia.com/ershoufang/'


# 实例化chromedriver
def get_chromedriver():
    # 设置参数
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')  # 控制是否显示浏览器,注释将显示
    # chrome_options.add_argument("--start-maximized")#控制浏览器运行时的窗口大小
    chrome_options.add_argument('--disable-gpu')
    driverpath = "E:\chromedriver.exe"  # 下载的chromedriver.exe的全路径
    # 创建谷歌浏览器驱动对象，用于后续操作浏览器
    chromedriver = webdriver.Chrome(executable_path=driverpath, chrome_options=chrome_options)
    return chromedriver


# 获取不同区的URL,参数为城市二手房首页的url，青岛的为：https://qd.lianjia.com/ershoufang/
def get_range_url():
    # 声明list用于存储不同区的url
    range_urls = {}
    driver = get_chromedriver()
    driver.get(city_url)
    html = driver.page_source
    selector = etree.HTML(html)
    # 获取青岛不同区对应的URL
    for i in range(0, 10):  # 青岛市分为10个区
        a_href = str(
            selector.xpath('//*[@class="position"]/dl[2]/dd/div[1]/div/a[' + str(i + 1) + ']/@href')[0])  # 标签索引从1开始
        rangename = str(selector.xpath('//*[@class="position"]/dl[2]/dd/div[1]/div/a[' + str(i + 1) + ']/text()')[0])
        range_url = 'https://qd.lianjia.com' + a_href
        range_urls[rangename] = range_url
    return range_urls


# 根据已获取的不同区的URL，获取不同区不同售价的URL
def get_range_price_url():
    # 获取不同区的URL
    range_urls = get_range_url()
    # 声明字典用于存储不同区不同售价的URL，key为每个区名，value为该区对应的8个售价的url
    range_price_urls = {}
    for key in range_urls:
        range_url = range_urls[key]
        part_range_price_url = []
        for i in range(1, 9):  # 按售价分为8个区间，依次在按区的URL后增加p1/,p2/,...p8/
            range_price_url = range_url + 'p' + str(i) + '/'
            part_range_price_url.append(range_price_url)
        range_price_urls[key] = part_range_price_url
    return range_price_urls


# 根据已获取的不同区不同售价的URL，获取不同区不同售价不同页的URL，并将url写入excel中
def get_range_price_page_url():
    range_price_urls = get_range_price_url()
    range_price_page_urls = {}
    # 创建workbook（即excel文件）
    workbook = xlwt.Workbook(encoding='utf-8')
    # 创建g工作簿（即表）
    worksheet = workbook.add_sheet('Sheet1')
    count = 0
    for key in range_price_urls:
        try:
            driver = get_chromedriver()
        except Exception:
            driver = get_chromedriver()
        part_range_price_urls = range_price_urls[key]
        for part_range_price_url in part_range_price_urls:
            # 请求URL获取该页面中房源的个数，从而计算有多少页
            try:
                driver.get(part_range_price_url)
            except Exception:
                driver.get(part_range_price_url)
            # 等待2秒，以便浏览器加载所有资源，受网速影响如果网站需要加载资源较多可能加载不完全
            # time.sleep(2)
            html = driver.page_source
            selector = etree.HTML(html)
            # 根据不同区不同售价url页面中的总房源数（每页30天，最后一页不足30条）计算有多少页
            house_count = selector.xpath('//*[@class="resultDes clear"]/h2/span/text()')
            yushu = int(house_count[0]) % 30
            # page_count = 0
            if yushu is 0:
                page_count = int(int(house_count[0]) / 30)
            else:
                page_count = int(int(house_count[0]) / 30) + 1
            # part_range_price_page_urls=[]
            # 构造不同区不同售价不同页码的URL
            for i in range(0, page_count):
                # range_price_page_url=''
                if i is 0:
                    range_price_page_url = part_range_price_url
                else:
                    list_ss = part_range_price_url.split('/')
                    url_priceId = list_ss[5]
                    range_price_page_url = part_range_price_url.replace(url_priceId, 'pg' + str(i + 1) + url_priceId)
                # part_range_price_page_urls.append(range_price_page_url)
                # 将每页的URL写如excel文件中
                worksheet.write(count, 0, key)  # 第一列写入区
                worksheet.write(count, 1, range_price_page_url)  # 第二列写入url
                count += 1
                print(str(count))
        driver.quit()
    workbook.save('range_price_page_urls.xls')
    print('OK')


# 获取每一个房源详情页的url
def get_finall_urls():
    # 读取get_range_price_page_url（）生成的excel文件：range_price_page_urls.xls
    data = xlrd.open_workbook('range_price_page_urls.xls')
    table = data.sheets()[0]  # 通过索引顺序获取表
    # 获取行数
    row_count = table.nrows
    driver = get_chromedriver()
    # 创建workbook（即excel文件）
    workbook = xlwt.Workbook(encoding='utf-8')
    # 创建g工作簿（即表）
    worksheet = workbook.add_sheet('Sheet1')
    count = 0
    for i in range(0, row_count):
        # 读取区名和url后发现该值形如：text:'区名'、text:'url'，但excel文件中仅显示的为区名和url（这里原因我暂时没有仔细考虑，可能是编码不一致的问题）
        # 所以就用一个正则直接把区名和url给提取出来
        pattern = re.compile("text:'" + '(.*?)' + "'", re.S)
        rangename_temp = str(table.cell(i, 0))
        rangename = pattern.findall(rangename_temp)[0]
        url_temp = str(table.cell(i, 1))
        url = pattern.findall(url_temp)[0]
        try:
            driver.get(url)
        except Exception:
            driver.get(url)
        time.sleep(2)
        html = driver.page_source
        selector = etree.HTML(html)
        for j in range(0, 30):
            try:
                finall_url = selector.xpath('//*[@class="sellListContent"]/li[' + str(j + 1) + ']/a/@href')[
                    0]  # 某一个房源的详情页
            except Exception:
                break
            worksheet.write(count, 0, rangename)  # 第一列写入区
            worksheet.write(count, 1, finall_url)  # 第二列写入url
            count += 1
            print(str(count) + '/30266')
    driver.quit()
    workbook.save('finall_urls.xls')
    print('OK')


# 爬取每一个房源详情页中的信息
def get_house_info():
    # 读取get_finall_urls（）生成的excel文件：finall_urls.xls
    data = xlrd.open_workbook('finall_urls.xls')
    table = data.sheets()[0]  # 通过索引顺序获取表
    # 获取行数
    row_count = table.nrows
    # 启动一个driver
    driver = get_chromedriver()
    f = open("qingdao34"
             ".txt", 'w', encoding='utf-8')
    for i in range(0, row_count):
        # 这里同样会出现get_finall_urls（）函数中的问题，处理方法与其一样
        pattern = re.compile("text:'" + '(.*?)' + "'", re.S)
        rangename_temp = str(table.cell(i, 0))
        rangename = pattern.findall(rangename_temp)[0]
        url_temp = str(table.cell(i, 1))
        url = pattern.findall(url_temp)[0]
        try:
            driver.get(url)
        except Exception:
            driver.get(url)
        time.sleep(2)
        # 获取房源详情页面
        html = driver.page_source
        # 解析详情页  获取所需信息
        selector = etree.HTML(html)
        try:
            # 获取总价
            total_price = selector.xpath('//*[@class="total"]/text()')[0]
            # 获取单价
            unit_price = selector.xpath('//*[@class="unitPriceValue"]/text()')[0]
            # 获取小区名称
            apartment_name = selector.xpath('//*[@class="communityName"]/a[1]/text()')[0]
            # 获取所在区域
            inrange = selector.xpath('//*[@class="info"]/a[2]/text()')[0]
            # 通过正则表达式匹配获取经纬度信息
            pattern = re.compile("resblockPosition:'" + '(.*?)' + "',", re.S)
            pos = pattern.findall(html)[0]
            lon = pos.split(',')[0]
            lat = pos.split(',')[1]
            # 获取基本信息 ,包括以下13个基本属性
            # 1.房屋户型
            house_type = selector.xpath('//*[@class="base"]/div[2]/ul/li[1]/text()')
            # 2所在楼层
            floor = selector.xpath('//*[@class="base"]/div[2]/ul/li[2]/text()')[0]
            # 3建筑面积
            out_area = selector.xpath('//*[@class="base"]/div[2]/ul/li[3]/text()')[0]
            # 4户型结构
            house_stru = selector.xpath('//*[@class="base"]/div[2]/ul/li[4]/text()')[0]
            # 5套内面积
            in_area = selector.xpath('//*[@class="base"]/div[2]/ul/li[5]/text()')[0]
            # 6建筑类型
            build_type = selector.xpath('//*[@class="base"]/div[2]/ul/li[6]/text()')[0]
            # 7房屋朝向
            house_direc = selector.xpath('//*[@class="base"]/div[2]/ul/li[7]/text()')[0]
            # 8建筑结构
            bulid_stru = selector.xpath('//*[@class="base"]/div[2]/ul/li[8]/text()')[0]
            # 9装修情况
            decorate = selector.xpath('//*[@class="base"]/div[2]/ul/li[9]/text()')[0]
            # 10梯户比例
            ratio = selector.xpath('//*[@class="base"]/div[2]/ul/li[10]/text()')[0]
            # 11供暖方式
            heating = selector.xpath('//*[@class="base"]/div[2]/ul/li[11]/text()')[0]
            # 12配备电梯
            elevator = selector.xpath('//*[@class="base"]/div[2]/ul/li[12]/text()')[0]
            # 13产权年限
            age_limit = selector.xpath('//*[@class="base"]/div[2]/ul/li[13]/text()')[0]
            # 获取交易属性 ,包括以下8个
            # 1.挂牌时间
            pull_time = selector.xpath('//*[@class="transaction"]/div[2]/ul/li[1]/span[2]/text()')[0]
            # 2交易权属
            deal_owner = selector.xpath('//*[@class="transaction"]/div[2]/ul/li[2]/span[2]/text()')[0]
            # 3上次交易
            lasttime = selector.xpath('//*[@class="transaction"]/div[2]/ul/li[3]/span[2]/text()')[0]
            # 4房屋用途
            house_use = selector.xpath('//*[@class="transaction"]/div[2]/ul/li[4]/span[2]/text()')[0]
            # 5房屋年限
            house_age = selector.xpath('//*[@class="transaction"]/div[2]/ul/li[5]/span[2]/text()')[0]
            # 6产权所属
            right_owner = selector.xpath('//*[@class="transaction"]/div[2]/ul/li[6]/span[2]/text()')[0]
            # 7抵押信息,这里存在换行符和空格，需要处理
            pledge_info = selector.xpath('//*[@class="transaction"]/div[2]/ul/li[7]/span[2]/text()')[0].replace('\n',
                                                                                                                '').replace(
                ' ', '')
            # 8房本备件
            house_part = selector.xpath('//*[@class="transaction"]/div[2]/ul/li[8]/span[2]/text()')[0]
        except Exception:
            continue
            # 将获取的所有信息写入文本文件中
        f.write("%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s@%s" % (
            total_price, unit_price, apartment_name, inrange, lon, lat, house_type, floor, out_area, house_stru,
            in_area,
            build_type, house_direc, bulid_stru, decorate, ratio, heating, elevator, age_limit, pull_time, deal_owner,
            lasttime, house_use, house_age, right_owner, pledge_info, house_part
        ))
        f.write('\n')
        print(str(i + 1))
    f.close()
    print('OK')


def main():
    # get_range_price_page_url()#调用一次即可,生成的excel文件range_price_page_urls.xls，将在get_finall_urls()中使用
    # get_finall_urls()#调用一次即可,生成的excel文件finall_urls.xls，将在get_house_info()中使用
    get_house_info()


if __name__ == '__main__':
    main()
