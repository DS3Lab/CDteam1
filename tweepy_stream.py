import utils
import json
from pymongo import MongoClient
import urllib
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

conf = utils.get_config()

access_token = conf["Credentials"]["access_token"]
access_token_secret = conf["Credentials"]["access_token_secret"]
consumer_key = conf["Credentials"]["consumer_key"]
consumer_secret = conf["Credentials"]["consumer_secret"]
raw_pass = conf["Credentials"]["raw_pass"]

url = "mongodb://CDteam1:" + urllib.parse.quote_plus(raw_pass) + "@spaceml4.ethz.ch:27017/CDteam1DB"
client = MongoClient(url)
db = client.CDteam1DB
foo = db.foo

class StdOutListener(StreamListener):

    def on_data(self, data):
        data = json.loads(data)

        foo.insert_one(data)
        return True

    def on_error(self, status):
        print (status)


if __name__ == '__main__':

    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)
    stream.filter(track=conf["Parameters"]["keywords"])
