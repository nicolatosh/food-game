FROM python:3.7-alpine
WORKDIR /adapter
ADD requirements.txt /adapter/requirements.txt
RUN pip install -r requirements.txt
ADD adapter.py /adapter/adapter.py
COPY . .
EXPOSE 5000
CMD ["python", "adapter.py"]