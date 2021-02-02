FROM python:3.7.9-alpine
COPY . /app/
WORKDIR /app
RUN python -m pip install --upgrade pip
RUN python -m venv env
RUN source ./env/bin/activate
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python","app.py"]
