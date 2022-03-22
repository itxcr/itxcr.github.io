# from lxml import etree
# import time
# from selenium import webdriver
# import pymongo
#
# user_name = 'xcr01'
# user_pwd = 'dagongren'
# host = 'www.atlantide.top'
# port = 60001
# db_name = 'dagongren'
# client = pymongo.MongoClient(
#     "mongodb://{username}:{password}@{host}:{port}/{db_name}".format(username=user_name, password=user_pwd, host=host,
#                                                                      port=port,
#                                                                      db_name=db_name))
#
# mydb = client['dagongren']
# mycol = mydb['tianjin_all_urls']
# my_details = mydb['tianjin_detail_urls']
#
#
# def get_chromedriver():
#     chrome_options = webdriver.ChromeOptions()
#     chrome_options.add_argument('–disable-infobars')
#     chrome_options.add_argument('--headless')
#     chrome_options.add_argument('--disable-gpu')
#     chrome_options.add_argument("--disable-blink-features=AutomationControlled")
#     chrome_options.add_argument("--no-first-run")
#     chrome_options.add_argument('blink-settings=imagesEnabled=false')
#     chrome_options.add_argument('page_load_strategy=none')
#     driver_path = 'D:\softwares\chromedriver.exe'
#     return webdriver.Chrome(executable_path=driver_path, chrome_options=chrome_options)
#
#
# # 获取每一个房源详情页的url
# def get_final_urls():
#     col_data = list(mycol.find({}, {'url': 1, '_id': 0}))
#     driver = get_chromedriver()
#     for i in col_data:
#         area_url = i['url']
#         try:
#             driver.get(area_url)
#         except Exception:
#             driver.get(area_url)
#         html = driver.page_source
#         selector = etree.HTML(html)
#         for j in range(0, 30):
#             try:
#                 detail_url = selector.xpath('//*[@id="content"]/div[1]/ul/li[' + str(j + 1) + ']/div[1]/div[1]/a/@href')[0]
#                 detail_title = selector.xpath('//*[@id="content"]/div[1]/ul/li[' + str(j + 1) + ']/div[1]/div[1]/a/text()')[0]
#             except Exception:
#                 break
#             try:
#                 my_details.insert_one({'title': detail_title, 'url': detail_url})
#             except Exception:
#                 continue
#             print(detail_title + ':' + detail_url)
#     driver.quit()
#     client.close()
#
# get_final_urls()
