# https://www.youtube.com/watch?v=ximjGyZ93YQ
from selenium import webdriver
import time
# 按键库
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

import os


PATH = 'D:\softwares\chromedriver.exe'
driver = webdriver.Chrome(PATH)
driver.get('https://gz.kfang.com/xiaoqu')

result = driver.find_elements_by_class_name('items')
for title in result:
    print(title.text)
# WebDriverWait(driver, 10).until(
#     EC.presence_of_element_located((By.CLASS_NAME, 'myD'))
# )

time.sleep(5)
# print(driver.title)
driver.quit()