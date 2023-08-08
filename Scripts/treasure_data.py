import json

#Importing all treasure data

with open('Treasure Data\BaseData.json') as json_file:
    basedata = json.loads(json_file.read())

with open('Localization\OtakaraName_Result\en-US\OtakaraName_Result.json') as json_file:
    otakaraname = json.loads(json_file.read())

with open('Localization\OtakaraSeries_Result\en-US\OtakaraSeries_Result.json') as json_file:
    otakaraseries = json.loads(json_file.read())

with open('Localization\OtakaraDesc\en-US\OtakaraDesc.json') as json_file:
    otakaradesc = json.loads(json_file.read())

with open('Localization\OtakaraDescLouie\en-US\OtakaraDescLouie.json') as json_file:
    otakaradesclouie = json.loads(json_file.read())

with open('Localization\OtakaraDescOlimar\en-US\OtakaraDescOlimar.json') as json_file:
    otakaradescolimar = json.loads(json_file.read())

def get_treasure_data():

    #Grab all the data about all treasures

    data_list = []

    for treasure in otakaraname['OtakaraName_Result']:
        treasure_dict = {'Internal name': treasure}
        treasure_dict['Name'] = otakaraname['OtakaraName_Result'][treasure].split(']')[-1]
        if treasure in basedata[0]['Rows']:
            treasure_dict['ActorName'] = basedata[0]['Rows'][treasure]['ActorName']
            treasure_dict['Weight'] = basedata[0]['Rows'][treasure]['CarryWeightMin']
            treasure_dict['Carry Max'] = basedata[0]['Rows'][treasure]['CarryWeightMax']
            treasure_dict['Sparklium'] = basedata[0]['Rows'][treasure]['Kira']
            # treasure_dict['Challenge Points'] = basedata[0]['Rows'][treasure]['CarryWeightMin']
            # treasure_dict['Battle Points'] = basedata[0]['Rows'][treasure]['CarryWeightMin']
        if treasure in otakaradesc['OtakaraDesc']:
            treasure_dict['Description'] = otakaradesc['OtakaraDesc'][treasure].split(']')[-1]
        if treasure in otakaradesclouie['OtakaraDescLouie']:
            treasure_dict['Louie Desc.'] = otakaradesclouie['OtakaraDescLouie'][treasure].split(']')[-1]
        if treasure in otakaradescolimar['OtakaraDescOlimar']:
            treasure_dict['Olimar Desc.'] = otakaradescolimar['OtakaraDescOlimar'][treasure].split(']')[-1]
        data_list.append(treasure_dict)

    return data_list

with open('Ready for spreadsheet/Treasure_data.json', 'w') as json_file:
    json_file.write(json.dumps(get_treasure_data(), indent = 2))