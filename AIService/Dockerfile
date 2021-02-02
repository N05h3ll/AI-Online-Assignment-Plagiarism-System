FROM python:3.7.9-alpine
COPY . /app/
WORKDIR /app
RUN python -m pip install --upgrade pip
RUN python -m venv env
RUN source ./env/bin/activate
RUN pip install -r requirements.txt
RUN wget https://s3.amazonaws.com/dl4j-distribution/GoogleNews-vectors-negative300.bin.gz -P ./data/
RUN wget https://drive.google.com/uc?export=download&id=12wkwCK5WE6poVuODwlT7VTMzttZ2HH5j -P ./data/
RUN python -m nltk.downloader stopwords
EXPOSE 5000
CMD ["python","app.py"]

