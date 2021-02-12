FROM python:3.7-alpine
WORKDIR /user_adapter
ADD requirements.txt /user_adapter/requirements.txt
RUN pip install -r requirements.txt
COPY . .
ADD user_adapter.py /user_adapter/user_adapter.py
EXPOSE 5001
CMD ["python", "user_adapter.py"]