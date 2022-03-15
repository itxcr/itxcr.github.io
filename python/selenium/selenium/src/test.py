# https://www.youtube.com/watch?v=ximjGyZ93YQ
# 导入 selenium
from selenium import webdriver

# 按键库
# chromedriver 驱动程序存放路径
PATH = 'D:\softwares\chromedriver.exe'
# 创建一个 Chrome 浏览器驱动实例
driver = webdriver.Chrome(PATH)
# 设置一些参数
# 使用30秒隐式等待时间来定义 Selenium 执行步骤的超时时间，并调用 Selenium API 来最大化浏览器窗口
driver.implicitly_wait(30)
# driver.maximize_window()
# 调用 driver.get() 传入要访问页面 URL，在方法被调用后，webdriver 会等待，一直到页面加载完成后才继续控制脚本
# driver.get('https://gz.kfang.com/xiaoqu')
driver.get('https://tj.lianjia.com/ershoufang/jinnan/')
search_field = driver.find_element_by_id('searchInput')
search_field.clear()
search_field.send_keys("咸水沽")
search_field.submit()

products = driver.find_elements_by_xpath("//h2[@class='total fl'] | //div[@class='info clear']//div[@class='title'] | //div[@class='info clear']//div[@class='priceInfo']")
for product in products:
    print(product.text)

# result = driver.find_elements_by_class_name('items')
# for title in result:
#     print(title.text)
# WebDriverWait(driver, 10).until(
#     EC.presence_of_element_located((By.CLASS_NAME, 'myD'))
# )

# time.sleep(5)
# print(driver.title)
driver.quit()
#
# def getPageInfo(url):
#     products =
