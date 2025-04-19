import omdb
from omdb import OMDBClient

# must use OMDb API parameters
client = OMDBClient(apikey="6da2e614")
res = client.request(t='XYS BHH', y="2012", plot='full', r='json')
json_content = res.content

print(json_content)
