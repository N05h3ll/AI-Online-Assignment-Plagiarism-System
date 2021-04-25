from flask import Flask, request, make_response, jsonify
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS, cross_origin
from datetime import datetime
import spacy
import en_core_web_sm
import requests
from googleSearch import textExtractor, clean, querySearch, getContent, filterContent, sentences
from util import split_and_zero_padding, make_w2v_embeddings, ManDist
import json
import tensorflow as tf
import pandas as pd
import numpy as np
from gensim.models import KeyedVectors
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
app= Flask(__name__)
CORS(app, origins=['http://frontend:8080'], supports_credentials=True)


uploadFolder = './public'
allowedExtensions = {'doc', 'docx'}
wordVector = KeyedVectors.load_word2vec_format("./data/GoogleNews-vectors-negative300.bin.gz", binary=True)
model = tf.keras.models.load_model('./data/HeighstModel.h5', custom_objects={'ManDist': ManDist})
app.config['uploadFolder'] = uploadFolder
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowedExtensions



@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            res = make_response('No files were uploaded!, Please try again.', 422)
            return res
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            res = make_response('No files were uploaded!, Please try again.', 422)
            return res
        if not allowed_file(file.filename):
            res = make_response('Not supported file type!, we only support Microsoft word documents ".doc, .docx".', 415)
            return res
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename.rsplit('.')[0]+'-'+datetime.now().strftime("%Y-%m-%d-%H-%M-%S")+'.'+file.filename.rsplit('.')[1])
            file.save(os.path.join(app.config['uploadFolder'], filename))
            text = textExtractor(os.path.join(app.config['uploadFolder'], filename))
            text = clean(text)
            text = sentences(text)
            reportList = []
            opts = Options()
            opts.add_argument("--headless")
            opts.add_argument('--no-sandbox')
            opts.add_argument('--disable-dev-shm-usage')
            driver = webdriver.Remote(command_executor='http://selenium:4444/wd/hub', desired_capabilities=DesiredCapabilities.CHROME, options=opts)
            for i in text:
                reportList.append([i, False, 0, 'URL'])
            reportArray = np.array(reportList)
            fullList = []
            for sent in text:
                sites = querySearch(sent)
                if len(sites) == 0:
                    continue
                for site in sites:
                    content = getContent(site, driver)
                    cleanContent = list(filterContent(content, sent))
                    fullList.extend(list(map(lambda x: [sent, x, site], cleanContent)))
            driver.quit()
            npArray = np.array(fullList)
            compareDF = pd.DataFrame(npArray, columns=['baseSent', 'suspectSent', ''])
            for q in ['baseSent', 'suspectSent']:
                compareDF[q + '_n'] = compareDF[q]
            embedding_dim = 300
            max_seq_length = 40
            test_df, embeddings = make_w2v_embeddings(compareDF, wordVector, embedding_dim=embedding_dim)
            X_test = split_and_zero_padding(test_df, max_seq_length)
            assert X_test['left'].shape == X_test['right'].shape
            prediction = model.predict([X_test['left'], X_test['right']])

            similarIndexes = np.where(prediction > 0.5)

            for i in similarIndexes[0]:
                SentIndex = np.where(reportArray[:, 0] == npArray[i, 0])

                if (float(prediction[i, 0]) > float(reportArray[SentIndex, 2][0,0])):
                    
                    reportArray[SentIndex, 2] = prediction[i][0]
                    reportArray[SentIndex, 1] = True
                    reportArray[SentIndex, 3] = npArray[i][2]
            perCounter = 0
            baseParagraphList = []
            def determineTrue(value):
                return value == "True"
            for i in reportArray:

                baseParagraphList.append({"baseSentence": str(i[0]), "active": determineTrue(i[1]), "percentage": float(i[2]), "url": str(i[3])})
                if (float(i[2]) > 0):
                    perCounter = perCounter + 1
            totalPercentage = float((perCounter / len(reportArray)) * 100)
            responseObject = {}
            responseObject['author'] = request.values['name']
            responseObject['totalPercentage'] = totalPercentage
            responseObject['status'] = 'Passed' if totalPercentage < 50 else 'Failed'
            responseObject['uploadDate'] = datetime.now().strftime("%d/%m/%Y %H:%M")
            responseObject['fileName'] = file.filename
            responseObject['isSecondTrial'] = request.values['secondTrial']
            responseObject['baseParagraph'] = baseParagraphList
            responseObject['email'] = request.values['user']
            responseObject['assignmentID'] = request.values['assignmentID']
            responseObject['assignmentName'] = request.values['assignmentName']
            responseObject['assignmentCode'] = request.values['assignmentCode']
            responseObject['courseID'] = request.values['courseID']
            reportJson = json.loads(json.dumps(responseObject, indent=2))
            res = requests.post('http://backend:3000/api/report/addreport', json=reportJson)
            response = make_response(jsonify(message = 'Done'), 200)
            response.headers['Access-Control-Allow-Origin'] = request.environ['HTTP_ORIGIN']
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response
    return "GET Response"
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')