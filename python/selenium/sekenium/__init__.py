from selenium import webdriver
import time
# 按键库
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver

PATH = 'D:\softwares\chromedriver.exe'
driver = webdriver.Chrome(PATH)

driver.get('https://gz.kfang.com/xiaoqu')
result = driver.find_elements_by_class_name('items')
for title in result:
    print(title.text)
time.sleep(5)
# print(driver.title)
driver.quit()