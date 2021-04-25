import requests
from gensim.models import KeyedVectors
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from googlesearch import search

opts = Options()
opts.add_argument("--headless")
driver = webdriver.Chrome(options=opts)

url= 'https://www.researchgate.net/publication/299617100_Big_Data_Storage'
driver.get(url)


title = driver.find_element_by_tag_name('title')

if '(PDF)' in title.get_attribute('innerHTML').split():
	print('FOUND')
	print(title.get_attribute('innerHTML'))
	aTag = driver.find_element_by_class_name('gtm-download-fulltext-btn-header')
	parentTag = aTag.find_element_by_xpath('..')
	print(parentTag.get_attribute('href'))
	downUrl = parentTag.get_attribute('href')
	### First Method for download using requests. Get html file for JS validation and doesn't get the actual file
	r = requests.get(downUrl, allow_redirects=True, stream=True, headers={'User-agent': 'Mozilla/5.0'})
	open('facebook.pdf', 'wb').write(r.content)

	### Second Method using selenim, It gets the file but we don't have any information about the name, So we can't access it.
	parentTag.click()
