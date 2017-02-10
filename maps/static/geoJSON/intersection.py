import math


def length(A, B):
    return math.sqrt((A[0] - B[0]) ** 2 + (A[1] - B[1]) ** 2)


def line_intersection(A, B, C, D):
    AB = [A[0] - B[0], A[1] - B[1]]
    CD = [C[0] - D[0], C[1] - D[1]]

    c = AB[0] * CD[1] - AB[1] * CD[0]

    if math.fabs(c) < 0.0000001:
        return False
    else:
        a = A[0] * B[1] - A[1] * B[0]
        b = C[0] * D[1] - C[1] * D[0]

        x = (a * CD[0] - b * AB[0]) / c
        y = (a * CD[1] - b * AB[1]) / c

        lenab = length(A, B)
        lencd = length(C, D)
        L = (x, y)

        # print L

        if length(L, A) < lenab and length(L, B) < lenab and length(L, C) < lencd and length(L, D) < lencd: return True

        return False


def belongs_to_polygon(lat, lng, polygon):
    count_of_intersections_to_north = 0
    count_of_intersections_to_east = 0
    count_of_intersections_to_northeast = 0
    for side in polygon:
        # shooting a ray from point to north
        if line_intersection((lat, lng), (lat + 100, lng), (side[0], side[1]), (side[2], side[3])):
            # print (side[0], side[1]), (side[2], side[3])
            count_of_intersections_to_north += 1
        # shooting a ray from point to east
        if line_intersection((lat, lng), (lat, lng + 100), (side[0], side[1]), (side[2], side[3])):
            count_of_intersections_to_east += 1
        # shooting a ray from point to northeast
        if line_intersection((lat, lng), (lat + 100, lng + 100), (side[0], side[1]), (side[2], side[3])):
            count_of_intersections_to_northeast += 1

    is_in_north = count_of_intersections_to_north % 2 == 1
    is_in_east = count_of_intersections_to_east % 2 == 1
    is_in_northeast = count_of_intersections_to_northeast % 2 == 1
    # print count_of_intersections_to_north
    # print count_of_intersections_to_east
    # print count_of_intersections_to_northeast

    if (is_in_north and is_in_east) or (is_in_north and is_in_northeast) or (is_in_east and is_in_northeast):
        return True
    return False


# print myintersection((0.0, 0.0), (3.0, 3.0), (1.0, 0.0), (4.0, 4.0))

pointx, pointy = 50.4510931455669, 30.51487505435944
polygon = [[50.4508927, 30.5144712, 50.4512423, 30.5146152], [50.4512423, 30.5146152, 50.4512316, 30.5152587],
           [50.4512316, 30.5152587, 50.4511956, 30.5152951], [50.4511956, 30.5152951, 50.450969, 30.5152017],
           [50.450969, 30.5152017, 50.4510083, 30.5149657], [50.4510083, 30.5149657, 50.4511722, 30.5150332],
           [50.4511722, 30.5150332, 50.4511756, 30.5148279], [50.4511756, 30.5148279, 50.4508552, 30.514696]]

# print belongs_to_polygon(pointx, pointy, polygon)

import geojson

streets = {'Yaroslaviv_Val': [[30.505643145821526, 50.45416079364676], [30.505822854091292, 50.45400821435058],
                              [30.50627212476573, 50.453593389389084], [30.506384442434328, 50.45338359285684],
                              [30.506526711481243, 50.45324531786968], [30.506826225264184, 50.453149955809565],
                              [30.507843921604753, 50.45234811582373], [30.50823145984103, 50.45207653743576],
                              [30.508662085782472, 50.45172508056321], [30.50987246289629, 50.45079929580428],
                              [30.510063360341036, 50.450682417112446], [30.510503815320995, 50.45028881493895],
                              [30.51114638364507, 50.44974939325974], [30.511808674819203, 50.44924835634224],
                              [30.51201725595585, 50.449071310842946], [30.51246929004141, 50.44903035536889],
                              [30.512771720459625, 50.44895940433687], [30.51291099762592, 50.44891632692457],
                              [30.513698908452323, 50.448774424860524], [30.51429183124594, 50.4486781341742],
                              [30.51450327464834, 50.44865672040905], [30.514638572467017, 50.44901147556916],
                              [30.513225904066122, 50.44926487211211], [30.512322592159077, 50.4494194440033],
                              [30.51166751831615, 50.44996610304106], [30.511030693301407, 50.45046573391175],
                              [30.50971751850334, 50.45146898084655], [30.508525390949462, 50.45238505648536],
                              [30.50855117712197, 50.4525410473972], [30.50766141465605, 50.45315903272905],
                              [30.506832339741045, 50.45387017897113], [30.50633123670891, 50.454248709609345],
                              [30.505643145821526, 50.45416079364676]],
           'Kotsiubynskoho': [[30.504054776728232, 50.44750726236412], [30.504202159972984, 50.44785763783091],
                              [30.504334804893254, 50.448173601421495], [30.50423163662193, 50.44867100945023],
                              [30.503827473417548, 50.449221340464405], [30.503152425799232, 50.4500745232328],
                              [30.503034633228335, 50.45018113284738], [30.502920684164703, 50.4503126528398],
                              [30.50284043118912, 50.45047043503617], [30.502642006591724, 50.450633363438556],
                              [30.502443581994328, 50.45025596805751], [30.502642006591724, 50.450029863335836],
                              [30.50266066650354, 50.449904929490906], [30.50275414137886, 50.44974483355507],
                              [30.50320217612606, 50.449186550291664], [30.503618090785906, 50.448654777527],
                              [30.50374853064297, 50.44833550755934], [30.503520118099704, 50.44758577288203],
                              [30.504054776728232, 50.44750726236412]],
           'Lypynskoho': [[30.503684430983306, 50.449039879823225], [30.50536371567394, 50.449156442232976],
                          [30.506386408009234, 50.44919698567985], [30.50837816475075, 50.448915317378045],
                          [30.50952687126915, 50.44878383613368], [30.50965818974022, 50.44906257233092],
                          [30.508607641971675, 50.44924501784183], [30.507111407271008, 50.449460404903334],
                          [30.506275941272293, 50.449581723431265], [30.50508704976468, 50.44948474450742],
                          [30.50374926574405, 50.44939677087221], [30.50345594803185, 50.44930030280831],
                          [30.503684430983306, 50.449039879823225]],
           'Franka': [[30.508914233234552, 50.44669132528265], [30.509518607645628, 50.448104792132106],
                      [30.509875369136072, 50.448912143258724], [30.510136170762568, 50.44947601912017],
                      [30.510170254094945, 50.44983042025913], [30.510398055705966, 50.45047162339608],
                      [30.510417782717926, 50.45060699139447], [30.51004770339037, 50.45093133896945],
                      [30.50991638491931, 50.45059938949819], [30.509753231667375, 50.450176217271476],
                      [30.50955028493936, 50.44970236573617], [30.50946447619487, 50.449377381547926],
                      [30.509115194609898, 50.44860009717679], [30.5088496873505, 50.44797215113215],
                      [30.508438708443848, 50.44698187341981], [30.508621467941442, 50.44678403178833],
                      [30.508914233234552, 50.44669132528265]],
           'Honchara': [[30.507740846778084, 50.451440450529745], [30.50655777895563, 50.45103404440726],
                        [30.50515672835742, 50.450616930756325], [30.503433896839777, 50.450057755893646],
                        [30.502235179782506, 50.449666711845886], [30.50242186522585, 50.45017350493178],
                        [30.503574462567947, 50.450539525076096], [30.505465008440634, 50.45113081513782],
                        [30.507413159788552, 50.45175150869626], [30.508587885547826, 50.452346780292956],
                        [30.50993191853675, 50.45334718899455], [30.510751310087244, 50.45395921454354],
                        [30.510958777331865, 50.45415715270347], [30.511129889279008, 50.45457018906848],
                        [30.511312517031875, 50.45523740238823], [30.511918190202874, 50.455287261336764],
                        [30.511858084525695, 50.45508716264922], [30.511705605423714, 50.454573562307495],
                        [30.51180871304349, 50.45436500548203], [30.51171773573191, 50.454264589232736],
                        [30.511626758420345, 50.45423755408869], [30.511311370406894, 50.45375478365937],
                        [30.50963620927751, 50.452637447143864], [30.50876266596185, 50.45194900555138],
                        [30.507740846778084, 50.451440450529745]],
           'Stritenska': [[30.512241076642017, 50.453630746004414], [30.50896896585705, 50.45453427316001],
                          [30.507782701608793, 50.45482848452172], [30.508018514800387, 50.4551100362361],
                          [30.50839679846191, 50.45508500941704], [30.508588396680075, 50.45496926037892],
                          [30.50988536923385, 50.45462201326451], [30.51260792769519, 50.4539009525432],
                          [30.512241076642017, 50.453630746004414]],
           'Rylskyi_prov': [[30.51372806905192, 50.454808220516455], [30.513661157058802, 50.45441461121975],
                            [30.516680942654475, 50.453907818133864], [30.516713389151544, 50.4542727091557],
                            [30.51401929834353, 50.45472375500214], [30.51372806905192, 50.454808220516455]],
           'Lysenka': [[30.511671900467743, 50.44623804720302], [30.51185170611646, 50.4466365921035],
                       [30.51208923151144, 50.44734368784535], [30.51281314762905, 50.449151785199355],
                       [30.51225790646193, 50.44924932632141], [30.511632160698117, 50.44765062965395],
                       [30.511151841466038, 50.446317066004674], [30.511671900467743, 50.44623804720302]],
           'Khmelnytskogo': [[30.515408387707332, 50.44530528018842], [30.513667688479256, 50.44562197759005],
                             [30.513000521527744, 50.445784188454304], [30.503030474069707, 50.44745968551907],
                             [30.501343691332735, 50.44775261204966], [30.501545863136226, 50.448129292187105],
                             [30.50565668980724, 50.4474474534573], [30.51113816772581, 50.446560405269665],
                             [30.51598545904341, 50.44581269953124], [30.515408387707332, 50.44530528018842]]}

for key, value in streets.items():
    curr = []
    for i in xrange(1, len(value)):
        curr.append(value[i - 1] + value[i])
    streets[key] = curr

# facades block start
#
# with open('facades.geoJSON') as infile:
#     facades_json = geojson.load(infile)
#
# feature_collection = geojson.FeatureCollection([])
#
# for feature in facades_json.features:
#     for key in streets:
#         is_on_street = True
#         for point in feature.geometry.coordinates:
#             # print point
#             if not belongs_to_polygon(point[0], point[1], streets[key]):
#                 is_on_street = False
#         if is_on_street:
#             if 'streets' in feature.properties:
#                 if not (key in feature.properties['streets']):
#                     feature.properties['streets'].append(key)
#             else:
#                 feature.properties['streets'] = [key]
#             feature_collection['features'].append(feature)
#
# print geojson.dumps(facades_json)

# facades block end

# trees block start
#
# with open('trees_GeoCoo.json.geojson') as infile:
#     trees_json = geojson.load(infile)
#
# feature_collection = geojson.FeatureCollection([]);
#
# for feature in trees_json.features:
#     for key in streets:
#         if belongs_to_polygon(feature.geometry.coordinates[0],feature.geometry.coordinates[1],streets[key]):
#             if 'streets' in feature.properties:
#                 if not (key in feature.properties['streets']):
#                     feature.properties['streets'].append(key)
#             else:
#                 feature.properties['streets'] = [key]
#             feature_collection['features'].append(feature)
#
# print geojson.dumps(trees_json)

# trees block end

# first floor fucntion/buildings/cars block start

with open('Yarvalcars_night_GeoCoo.json.geojson') as infile:
    fff_json = geojson.load(infile)

feature_collection = geojson.FeatureCollection([])

for feature in fff_json.features:
    for key in streets:
        is_on_street = False
        for point in feature.geometry.coordinates[0]:
            if belongs_to_polygon(point[0], point[1], streets[key]):
                is_on_street = True
        if is_on_street:
            if 'streets' in feature.properties:
                if not (key in feature.properties['streets']):
                    feature.properties['streets'].append(key)
            else:
                feature.properties['streets'] = [key]
            feature_collection['features'].append(feature)

print geojson.dumps(fff_json)

# with open('cars.geojson', 'w') as outfile:
#     geojson.dump(fff_json, outfile)


# first floor fucntion block end








#
#
# with open('facades.geoJSON') as infile:
#     facades_json = geojson.load(infile)
#
# print facades_json.features
#
# feature_collection = geojson.FeatureCollection([])
# count_lines = 0
#
# for feature in facades_json.features:
#     count_lines += len(feature.geometry.coordinates) - 1
#     if len(feature.geometry.coordinates) > 2:
#         print feature.geometry.coordinates
#         for i in xrange(1, len(feature.geometry.coordinates)):
#             print feature.geometry.coordinates[i - 1:i + 1]
#             curr_geometry = geojson.LineString(feature.geometry.coordinates[i - 1:i + 1])
#             feature_collection['features'].append(
#                 geojson.Feature(geometry=curr_geometry, properties=feature.properties))
#             # print feature.geometry.coordinates
#     else:
#         feature_collection['features'].append(feature)
#
# print feature_collection
# print len(feature_collection.features)
# print count_lines
# print geojson.dumps(feature_collection)
#
# with open('facadesN.geoJSON', 'w') as outfile:
#     geojson.dump(feature_collection, outfile)
