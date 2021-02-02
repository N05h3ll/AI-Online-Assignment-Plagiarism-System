# Import Dependencies
import spacy
import urllib3
import en_core_web_sm
from spacy.matcher import Matcher
from googlesearch import search
from bs4 import BeautifulSoup
from urllib.request import urlopen
import urllib.request
import webbrowser
import re
import pandas as pd
import requests
from requests_html import HTML 
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import nltk
import docx2txt
import queue

#Get all top level domains maintained by ICAN (com, net, org, edu ...etc)
tlds = ["com","org","en","dev","net","to"]

#import Spacy language model
nlp = en_core_web_sm.load()
nlp = spacy.load('en_core_web_sm', disable=['ner', 'textcat'])
# Define Spacy matcher
matcher = Matcher(nlp.vocab, validate=True)
stopWords = nlp.Defaults.stop_words

# websites to filter from search result
top_websites = ['wikipedia', 'springer', 'researchgate']

# Selenium web driver configuration


def textExtractor(filePath):
    return docx2txt.process(filePath)
def text_sentence_tokenizer(text): 
    text = ' '.join(re.split(r'\s\s+', ' '.join(text.split('\n'))))
    # nltk sentence tokenizer
    sentences = nltk.sent_tokenize(text)
    sentences_no_punc = []
    #extract sentences with "." delimeter. ignoring nulls and "\n" and other simbols
    for s in sentences:
        sentences_no_punc.append(' '.join(s.split()).lower())
    return sentences_no_punc

def sentences(text):
    # split sentences and questions
    text = re.split('[.?]', text)
    clean_sent = []
    for sent in text:
        sent = re.sub("^ {1,}", "", str(sent))
        clean_sent.append(sent)
    return clean_sent




def clean(text):
    # removing paragraph numbers
    text = re.sub('[0-9]+.\t', '', str(text))
    # removing new line characters
    text = re.sub('\n ', '', str(text))
    text = re.sub('\n', ' ', str(text))
    # removing apostrophes
    text = re.sub("'s", '', str(text))
    # removing hyphens
    text = re.sub("-", ' ', str(text))
    text = re.sub("— ", '', str(text))
    # removing quotation marks
    text = re.sub('\"', '', str(text))
    # removing any reference to outside text
    text = re.sub("[\(\[].*?[\)\]]", "", str(text))
    text = re.sub("\^.*.", "", str(text))
    text = re.sub(" {2,}", "", str(text))
    return text


def get_site_name(url):
    # get site name providing the url
        sitename = url.split('//')[1]
        name = sitename.split('/')[0].rsplit('.')[1]
        if name in tlds :
            name = sitename.split('/')[0].rsplit('.')[0]
        return name

def getContent(url, driver) :
    # get web page content providing url
        page = driver.get(url)
        body_el = driver.find_element_by_css_selector("body")
        html_str = body_el.get_attribute("innerHTML")
        html_obj = HTML(html=html_str)
        return html_obj.text
         
def filterContent(text, query):
    # filter page content providing page content and query.
    queryList = query.split()
    cleanQueryList = [word for word in queryList if not word in stopWords]

    cleanText = clean(text)
    cleanSent = sentences(cleanText)
    # sentDf = pd.DataFrame(cleanSent, columns=['sent']) 
    
    pattern = [[{"LOWER": word}] for word in cleanQueryList]
    pattern.append([{"LOWER": {"REGEX":f".*{query}.*"}}])

    matcher.add('names', None, *pattern)
    sentList = filter(lambda x: matcher(nlp(x)), cleanSent)
    # for bodySent in sentDf['sent']:
    #     doc = nlp(bodySent)
    #     matches = matcher(doc)
    #     if not matches:
    #         sentDf = sentDf[sentDf['sent'] != bodySent]

    # return sentDf['sent']
    return sentList

# ADD your query sentence to get search results
# query = "big data storage"
def querySearch(query):
# # Google search the query
    sites = search(query, start=0, num=10, stop=10, pause=2)
# # list of sites will be appended according to the top sites list
    results =[]
    for result in sites:
        try:
            # check if result in top sites list
            if get_site_name(result) in top_websites:
                results.append(result)
        except:
            print('ERROR')
    return results

class MessageAnnouncer:

    def __init__(self):
        self.listeners = []

    def listen(self):
        q = queue.Queue(maxsize=5)
        self.listeners.append(q)
        return q

    def announce(self, msg):
        for i in reversed(range(len(self.listeners))):
            try:
                self.listeners[i].put_nowait(msg)
            except queue.Full:
                del self.listeners[i]

# for site in sites:
#     # get the content DataFrame from results list
#     print(filterContent(getContent(site), query))