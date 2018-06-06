import nltk
import json
import spacy
import numpy as np

nlp = spacy.load('en_core_web_sm')
from nltk.sentiment.vader import SentimentIntensityAnalyzer as SIA

sia = SIA()

def sentiment(tweet):
    score = np.argmax([sia.polarity_scores(tweet)["pos"], sia.polarity_scores(tweet)["neg"], sia.polarity_scores(tweet)["neu"]])
    if score == 0: return "pos"
    elif score == 1: return "neg"
    elif score == 2: return "neu"

def sentiment_comp(tweet):
    #sentiment_comp is more fine grained, and will detect partially positive and negative tweets as well.
    if sia.polarity_scores(tweet)["compound"]>0.2: return "pos"
    elif sia.polarity_scores(tweet)["compound"]<-0.2: return "neg"
    else : return "neu"

def mentioned(tweet):
    for word in tweet.split(" "):
        if word[0]=="@": return word


