#Chirag's Project - Start Date 13/07/2025

from fastapi import FastAPI, Query
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression 
from datetime import datetime, timedelta

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


#Allow REACT to talk to different ports (FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "ML Stock Tinder API is running!"}

@app.get("/predict")
def predict_stock(ticker: str = Query(..., description="Stock symbol like INFY.NS")):
    try:
        #last 60days of data
        data = yf.download(ticker, period="60d", interval="1d")
        if data.empty:
            return {"error": "Invalid stock symbol or no data"}
        
        data = data.reset_index()
        data["Day"] = range(len(data))


        X = data[["Day"]]
        y = data["Close"]

        model = LinearRegression()
        model.fit(X,y)

        next_day = [[len(data)]]
        predicted_price = model.predict(next_day)[0] #Model.predict return a np array

        return {
            "symbol": ticker,
            "last_close": float(y.iloc[-1]), #Returns dictionary if float is removed
            "predicted_next_close": round(float(predicted_price), 2) #Converting from np float to native float
        }
    
    except Exception as e:
        return {"error" : str(e)}

@app.get("/")
def read_root():
    return {"message": "Hello from ML Stock Ticker API!"}


# print("Proof I showed up on 15/07/2025")

# 16/07/2025
