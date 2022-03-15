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

#### name 定位

