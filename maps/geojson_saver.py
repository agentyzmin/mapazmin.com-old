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
        sha = json.loads(response['sha'])

        r = requests.put(url, headers={'Authorization': 'token ' + token},
                         data={'message': str(datetime.now()), 'content': b64encode(data), 'sha': sha})
        response = json.loads(r.content.decode())
        print(response)

        # request = Request(url)
        # request.add_header('Authorization', 'token %s' % token)
        # response = urlopen(request)
        # sha = json.loads(response.read())['sha']
        #
        # request = Request(url)
        # request.get_method = lambda: 'PUT'
        # request.add_header('Authorization', 'token %s' % token)
        # request.add_data(
        #     '{'
        #     '"message": "' + str(datetime.now()) + '",' +
        #     '"content": "' + b64encode(data) + '",' +
        #     '"sha": "' + sha + '"}')
        # response = urlopen(request)
        # print(response.read())
    except requests.RequestException as e:
        print(e)

        r = requests.put(url, headers={'Authorization': 'token ' + token},
                         data={'message': 'another commit message', 'content': b64encode(data), 'sha': sha})
        response = json.loads(r.content.decode())
        print(response)
