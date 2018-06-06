import utils
import json
from pymongo import MongoClient
import urllib
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

conf = utils.get_config()

def credentials(i):

    if ( i == 1):

        access_token = conf["Credentials1"]["access_token"]
        access_token_secret = conf["Credentials1"]["access_token_secret"]
        consumer_key = conf["Credentials1"]["consumer_key"]
        consumer_secret = conf["Credentials1"]["consumer_secret"]
        raw_pass = conf["Credentials1"]["raw_pass"]
    elif (i == 2):
        access_token = conf["Credentials2"]["access_token"]
        access_token_secret = conf["Credentials2"]["access_token_secret"]
        consumer_key = conf["Credentials2"]["consumer_key"]
        consumer_secret = conf["Credentials2"]["consumer_secret"]
        raw_pass = conf["Credentials2"]["raw_pass"]

    return access_token,access_token_secret,consumer_key,consumer_secret,raw_pass

class StdOutListener(StreamListener):

    def on_data(self, data):

        data = json.loads(data)
        foo.insert_one(data)
        return True

    def on_error(self, status):
        print (status)


if __name__ == '__main__':
    i=1
    while True:
        access_token, access_token_secret, consumer_key, consumer_secret, raw_pass = credentials(i)

        url = "mongodb://CDteam1:" + urllib.parse.quote_plus(raw_pass) + "@spaceml4.ethz.ch:27017/CDteam1DB"
        client = MongoClient(url)
        db = client.CDteam1DB
        foo = db.foo
        try:
            access_token, access_token_secret, consumer_key, consumer_secret, raw_pass = credentials(i)
            l = StdOutListener()
            auth = OAuthHandler(consumer_key, consumer_secret)
            auth.set_access_token(access_token, access_token_secret)
            stream = Stream(auth, l)
            stream.filter(track=conf["Parameters"]["keywords"])

        except KeyboardInterrupt:
                print("Shutting down!!")
                raise

        except:
            if i == 1:
                i = 2
            else:
                i = 1
