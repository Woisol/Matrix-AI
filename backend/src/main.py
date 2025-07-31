from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Matrix Backend!"}

# Additional routes can be added here in the future.