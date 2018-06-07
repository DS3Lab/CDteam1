import nltk
import json
import spacy
import numpy as np

nlp = spacy.load('en_core_web_sm')
from nltk.sentiment.vader import SentimentIntensityAnalyzer as SIA

sia = SIA()

crypto_list = []
with open("crypto_glossary.txt") as file:
    for i, line in enumerate(file):
        if i == 0 : continue
        words = line.split(',')
        for word in words:
            crypto_list.append(word.strip())


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



def detect_keyws(tweet):
    # also deals with plurals

    detected = []  
    for word in tweet.split(" "):
        plural = 0
        if word[-1] == "s": 
            word_sing = word[:-1]
            plural = 1
        if word in crypto_list:
            if not word in detected:
                detected.append(word.lower().strip())
        elif plural:
            if word_sing in crypto_list:
                if not word_sing in detected:
                    detected.append(word_sing.lower().strip())
                
    return detected

