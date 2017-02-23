from urllib2 import urlopen, Request, HTTPError
from base64 import b64encode
import json

from datetime import datetime


def save_geojson(data):
    url = "https://api.github.com/repos/proggeo/geojson/contents/firstFloorFunctionGeo.json.geojson"
    token = "318deb17377fd588dc6ba658aba1a1efb715cfde"

    try:
        request = Request(url)
        request.add_header('Authorization', 'token %s' % token)
        response = urlopen(request)
        sha = json.loads(response.read())['sha']

        request = Request(url)
        request.get_method = lambda: 'PUT'
        request.add_header('Authorization', 'token %s' % token)
        request.add_data(
            '{'
            '"message": "' + str(datetime.now()) + '",' +
            '"content": "' + b64encode(data) + '",' +
            '"sha": "' + sha + '"}')
        response = urlopen(request)
        print response.read()
    except HTTPError as e:
        print e
        request = Request(url)
        request.get_method = lambda: 'PUT'
        request.add_header('Authorization', 'token %s' % token)
        request.add_data(
            '{'
            '"message": "another commit message",'
            '"content": "' + b64encode(data) + '"}')
        response = urlopen(request)
        print response.read()
