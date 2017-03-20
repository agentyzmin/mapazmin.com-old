# from urllib2 import urlopen, Request, HTTPError
from urllib.request import urlopen, Request, HTTPError
import requests
from base64 import b64encode
import json

from datetime import datetime


def save_geojson(data):
    url = "https://api.github.com/repos/proggeo/geojson/contents/firstFloorFunctionGeo.json.geojson"
    token = "318deb17377fd588dc6ba658aba1a1efb715cfde"

    try:
        r = requests.get(url, headers={'Authorization': 'token ' + token})
        response = json.loads(r.content.decode())
        sha = response['sha']

        r = requests.put(url, headers={'Authorization': 'token ' + token},
                         data={'message': str(datetime.now()), 'content': b64encode(data), 'sha': sha})
        response = json.loads(r.content.decode())
        print(response)
    except requests.RequestException as e:
        print(e)

        r = requests.put(url, headers={'Authorization': 'token ' + token},
                         data={'message': 'another commit message', 'content': b64encode(data), 'sha': sha})
        response = json.loads(r.content.decode())
        print(response)
