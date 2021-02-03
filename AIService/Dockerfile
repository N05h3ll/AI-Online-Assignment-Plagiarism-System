FROM python:3.7.9-slim-buster
RUN mkdir /usr/src/app/
COPY . /usr/src/app/
WORKDIR /usr/src/app/
RUN python -m pip install --upgrade pip
RUN python -m venv env
RUN /bin/bash -c "source /usr/src/app/env/bin/activate"
RUN pip install -r requirements.txt
RUN /bin/bash -c "apt update && apt install -y wget"
RUN /bin/bash -c "wget https://s3.amazonaws.com/dl4j-distribution/GoogleNews-vectors-negative300.bin.gz -P /usr/src/app/data/"
RUN /bin/bash -c "wget https://drive.google.com/uc?export=download&id=12wkwCK5WE6poVuODwlT7VTMzttZ2HH5j -P /usr/src/app/data/"
RUN python -m nltk.downloader stopwords
EXPOSE 5000
CMD ["python","app.py"]

