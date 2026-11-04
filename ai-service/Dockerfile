# Nutriva AI Service — image untuk Hugging Face Spaces (Docker SDK) atau container host lain.
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=7860 \
    APP_ENV=production

# HF Spaces menjalankan container sebagai UID 1000
RUN useradd -m -u 1000 app
WORKDIR /home/app/service

COPY --chown=app:app requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY --chown=app:app app ./app
COPY --chown=app:app src ./src
COPY --chown=app:app models ./models
COPY --chown=app:app who_tables ./who_tables
COPY --chown=app:app knowledge_base ./knowledge_base

USER app
EXPOSE 7860
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD python -c "import urllib.request,os;urllib.request.urlopen(f'http://127.0.0.1:{os.environ.get(\"PORT\",\"7860\")}/health',timeout=4)"

# 1 worker: rate limiter & cache in-memory; skala dengan menambah replika + Redis bila perlu
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 1 --proxy-headers --forwarded-allow-ips='*' --timeout-keep-alive 30"]
