import geojson
import geopy.distance
from intersection import belongs_to_polygon, STREETS

with open('firstFloorFunctionGeo.json.geojson') as infile:
    fff_json = geojson.load(infile)

for feature in fff_json.features:
    points = feature.geometry.coordinates[0]
    feature.properties['facades'] = {}
    for idx, point in enumerate(points):
        line = points[idx:idx + 2]
        if len(line) > 1:
            for key in STREETS:
                if belongs_to_polygon(line[0][0], line[0][1], STREETS[key]) \
                        and belongs_to_polygon(line[1][0], line[1][1], STREETS[key]):
                    length = geopy.distance.great_circle(line[0], line[1]).meters
                    if key in feature.properties['facades']:
                        feature.properties['facades'][key] += length
                    else:
                        feature.properties['facades'][key] = length

print fff_json
