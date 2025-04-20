from omdb import OMDBClient
from imdb import Cinemagoer
import json


print("\n\n Data from OMDB \n\n")
# must use OMDb API parameters
client = OMDBClient(apikey="6da2e614")
res = client.request(t="Dragon", y="2012", plot="short", r="json")
result_byte_data = res.content
decoded_str = result_byte_data.decode("utf-8")
json_data = json.loads(decoded_str)
print(json_data)


print("\n\n Data from IMDB \n\n")
# create an instance of the Cinemagoer class
ia = Cinemagoer()

results = ia.search_movie("Like Stars on Earth")
if results:
    # Get detailed info from first match
    movie = results[0]
    ia.update(movie)
    print(movie.infoset2keys)
