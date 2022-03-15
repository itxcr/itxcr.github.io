### 元素定位

必须告诉 Selenium 怎样去定位元素，用来模拟用户动作，或者查看元素的属性和状态，以便可以执行检查。

Selenium 提供多种 `find_element_by` 方法用于定位页面元素。这些方法根据一定的标准去查找元素，如果元素被正常定位，那么 WebElement 实例将返回。反之，将抛出 NoSuchElementException 的异常。同时，Selenium 还提供多种 `find_elements_by` 方法去定位多个元素，这类方法根据所匹配的值，搜索并返回一个 list 数组。

Selenium 提供 8 种 `find_element_by` 方法用于定位元素。

| 方法                                         | 描述                                     | 参数                          |                           示例                            |
| :------------------------------------------- | :--------------------------------------- | :---------------------------- | :-------------------------------------------------------: |
| find_element_by_id(id)                       | 通过元素的ID属性值来定位元素             | id:元素的ID                   |            driver.find_element_by_id('search')            |
| find_element_by_name(name)                   | 通过元素的name属性值来定位元素           | name:元素的name               |             driver.find_element_by_name('x')              |
| find_element_by_class_name(className)        | 通过元素的class名来定位元素              | className:元素的类名          |      driver.find_element_by_class_name('input-text')      |
| find_element_by_tag_name(tagName)            | 通过元素的tag name 来定位元素            | tagName：tag name             |         driver.find_element_by_tag_name('input')          |
| find_element_by_xpath(xpath)                 | 通过XPath来定位元素                      | xpath：元素的XPath            | driver.find_element_by_xpath('//form[0]/div[0]/input[0]') |
| find_element_by_css_selector(css_selector)   | 通过css选择器来定位元素                  | css_selector：元素的css选择器 |      driver.find_element_by_css_selector('#search')       |
| find_element_by_link_text(link_text)         | 通过元素标签之间的文本信息来定位元素     | link_text：文本信息           |        driver.find_element_by_link_text('Log In')         |
| find_element_by_partial_link_text(link_text) | 通过元素标签之间的部分文本信息来定位元素 | link_text：部分文本信息       |      driver.find_element_by_partial_link_text('Log')      |

#### ID 定位

通过 ID 查找元素是查找页面上元素的最佳方法。find_element_by_id() 和 find_elements_by_id() 方法返回与 ID 属性值匹配的一个元素或一组元素。

find_element_by_id() 返回与 ID 属性匹配的第一个元素，如果没有元素与之匹配，则抛出 NoSuchElementException 异常。find_elements_by_id() 返回匹配 ID 值的所有元素。

#### ...

### Webdriver 功能

| 功能/属性             | 描述                            | 实例                         |
| --------------------- | ------------------------------- | ---------------------------- |
| current_url           | 获取当前页面地址                | driver.current_url           |
| current_window_handle | 获取当前窗口的句柄              | driver.current_window_handle |
| name                  | 获取该实例底层的浏览器名称      | driver.name                  |
| orientation           | 获取当前设备的方位              | driver.orientation           |
| page_source           | 获取当前页面的源码              | driver.page_source           |
| title                 | 获取当前页面的标题              | driver.title                 |
| window_handles        | 获取当前session里所有窗口的句柄 | driver.window_handles        |

### Webdriver 方法

| 方法                                | 描述                                                         | 参数                                                         | 实例                                 |
| ----------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| back()                              | 后退一步到当前会话 的浏览器历史记录中最后一步操作前的页面    |                                                              | driver.back()                        |
| close()                             | 关闭当前浏览器窗口                                           |                                                              | driver.close()                       |
| forward()                           | 前进一步到当前会话的浏览器历史记录中前一步操作后的页面       |                                                              | driver.get(url)                      |
| get(url)                            | 访问目标URL并加载网页到当前的浏览器会话                      | URL为目标网址                                                | driver.get('https://www.google.com') |
| maximize_window()                   | 最大化当前浏览器窗口                                         |                                                              | driver.maximize_window()             |
| quit()                              | 退出当前driver并关闭所有的相关窗口                           |                                                              | driver.quit()                        |
| refresh()                           | 刷新当前页面                                                 |                                                              | driver.refresh()                     |
| switch_to_active_element()          | 返回当前页面唯一焦点所在的元素或者元素体                     |                                                              | driver.switch_to_active_element()    |
| switch_to_alert()                   | 把焦点切换至当前页面弹出的警告                               |                                                              | driver.switch_to_alert()             |
| switch_to_default_content()         | 切换焦点至默认框架内                                         |                                                              | driver.switch_to_default_content()   |
| switch_to_frame(frame_reference)    | 通过索引，名称和网页元素将焦点切换到指定的框架，这种方法也适用于IFRAMES | frame_reference：要切换的目标窗口的名称，整数类型的索引或者要切换的目标框架的网页元素 | driver.switch_to_frame('frame_name') |
| switch_to_window(window_name)       | 切换焦点到指定的窗口                                         | window_name：要切换的目标窗口的名称或者句柄                  | driver.switch_to_window('main')      |
| implicitly_wait(time_to_wait)       | 超时设置等待目标元素被找到，或者目标指令执行完成。该方法在每个 session 只需要调用一次 | time_to_wait：等待时间（单位为秒）                           |                                      |
| set_page_load_timeout(time_to_wait) | 设置一个页面完全加载完成的超时等待时间                       | time_to_wait：等待时间（单位为秒）                           | driver.set_page_load_timeout(30)     |
| set_script_timeout(time_to_wait)    | 设置脚本执行的超时时间，应在 execute_async_script 抛出错误之前 | time_to_wait：等待时间（单位为秒）                           | driver.set_script_timeout(30)        |

### WebElement 功能

| 功能/属性 | 描述                   | 实例             |
| --------- | ---------------------- | ---------------- |
| size      | 获取元素的大小         | element.size     |
| tag_name  | 获取元素的HTML标签名称 | element.tag_name |
| text      | 获取元素的文本值       | element.text     |

### WebElement 方法

| 方法                                 | 描述                                                         | 参数                         | 实例                                             |
| ------------------------------------ | ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------ |
| clear()                              | 清除文本框或者文本域中的内容                                 |                              | element.clear()                                  |
| click()                              | 单击元素                                                     |                              | element.click()                                  |
| get_attribute(name)                  | 获取元素的属性值                                             | name：元素的名称             | element.get_attribute('value')                   |
| is_displayed()                       | 检查元素对于用户是否可见                                     |                              | element.is_displayed()                           |
| is_enabled()                         | 检查元素是否可用                                             |                              | element.is_enabled()                             |
| is_selected()                        | 检查元素是否被选中。该方法应用于复选框和单选按钮             |                              | element.is_selected()                            |
| send_keys(value)                     | 模拟输入文本                                                 | value:输入的字符串           | element.send_keys('xcr')                         |
| submit()                             | 用于提交表单。如果对一个元素应用此方法，将会提交该元素所属的表单 |                              | element.submit()                                 |
| value_of_css_property(property_name) | 获取css属性的值                                              | property_name：css属性的名称 | element.value_of_css_property('backgroundcolor') |

### 隐式等待

### 显式等待

### 操作 cookies

| 方法                    | 描述                                     | 参数 | 实例 |
| ----------------------- | ---------------------------------------- | ---- | ---- |
| add_cookie(cookie_dict) | 在当前会话中添加 cookie 信息             |      |      |
| delete_all_cookies()    | 清除所有cookie信息                       |      |      |
| delete_cookie(name)     | 删除单个名为name 的cookie                |      |      |
| get_cookie(name)        | 返回名为name的cookie信息，没有则返回none |      |      |
| get_cookies()           | 返回当前会话的所有cookie信息             |      |      |

