# Use a secure, ultra-lightweight official Python production base layer
FROM python:3.10-slim
WORKDIR /app

# Install system utilities needed for internal check procedures
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Cache dependencies list separately to optimize container layer build times
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application code inside our working canvas space
COPY . .

# Expose our API network communication interface window
EXPOSE 5000

# Fire up our application layer server initialization workflow
CMD ["python", "app.py"]