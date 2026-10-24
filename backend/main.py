```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

app = FastAPI(title="Concept Collision Lab")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

emails = [
    "win free prize now",
    "claim cash reward",
    "meeting tomorrow",
    "project report attached",
    "exclusive offer now",
    "team meeting today",
    "free gift winner",
    "review project report",
    "urgent cash offer",
    "class starts tomorrow",
    "free reward waiting",
    "send meeting notes",
]

labels = [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0]

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)

model = MultinomialNB()
model.fit(X, labels)


class PredictionRequest(BaseModel):
    text: str
    threshold: int = 50


@app.get("/")
def home():
    return {
        "message": "Concept Collision Lab API is running"
    }


@app.post("/predict")
def predict(request: PredictionRequest):
    text = request.text.strip()

    if not text:
        return {"error": "Please enter an email"}

    threshold = max(1, min(99, request.threshold)) / 100

    features = vectorizer.transform([text])
    probability = model.predict_proba(features)[0][1]

    prediction = (
        "Spam" if probability >= threshold
        else "Not Spam"
    )

    return {
        "email": text,
        "spam_probability": round(float(probability) * 100, 2),
        "threshold": request.threshold,
        "prediction": prediction,
        "model": "Multinomial Naive Bayes",
    }
```