import geojson
import geopy.distance

with open('facades.geoJSON') as infile:
    facades_json = geojson.load(infile)

for feature in facades_json.features:
    a = feature.geometry.coordinates[0]
    b = feature.geometry.coordinates[1]
    length = geopy.distance.great_circle(a, b).meters
    feature.properties['length'] = length
    print(length)

print(geojson.dumps(facades_json))
