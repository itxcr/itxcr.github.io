import scrapy


class QuotesSpider(scrapy.Spider):
    name = 'quotes'
    start_urls = [
        'https://gz.kfang.com/xiaoqu',
    ]

    def parse(self, response, **kwargs):
        for quote in response.css('div.module-container div.left-box div.house-list-container div.items'):
            yield {
                'name': quote.css('a.title::text').get(),
            }
        next_page = response.css('div.pagination-container a.next').get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)
