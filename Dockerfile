FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev postgresql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "until pg_isready -h db -p 5432; do echo 'Waiting for Postgres...'; sleep 2; done && python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:8000"]
