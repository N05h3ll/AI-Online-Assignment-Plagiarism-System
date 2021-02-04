FROM python:3.7.9-slim-buster
RUN mkdir /usr/src/app/
COPY . /usr/src/app/
WORKDIR /usr/src/app/
RUN /bin/bash -c "mkdir /usr/src/app/data"
RUN /bin/bash -c "mkdir /usr/src/app/public"
RUN python -m pip install --upgrade pip
RUN python -m venv env
RUN /bin/bash -c "source /usr/src/app/env/bin/activate"
RUN pip install -r requirements.txt
RUN /bin/bash -c "apt update && apt install -y wget unzip"
RUN /bin/bash -c "wget -O chrome.deb 'https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb'"
RUN /bin/bash -c "dpkg -i chrome.deb; apt -fy install"
RUN /bin/bash -c "wget -O driver.zip 'https://chromedriver.storage.googleapis.com/89.0.4389.23/chromedriver_linux64.zip'"
RUN /bin/bash -c "unzip driver.zip -d /bin/"
RUN /bin/bash -c "wget https://s3.amazonaws.com/dl4j-distribution/GoogleNews-vectors-negative300.bin.gz -P /usr/src/app/data/"
RUN /bin/bash -c "wget --no-check-certificate 'https://drive.google.com/uc?export=download&id=12wkwCK5WE6poVuODwlT7VTMzttZ2HH5j' -O /usr/src/app/data/HeighstModel.h5"
RUN python -m nltk.downloader stopwords
RUN python -m nltk.downloader punkt
EXPOSE 5000
CMD ["python","app.py"]