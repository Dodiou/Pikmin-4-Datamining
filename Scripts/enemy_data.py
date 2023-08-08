import json

#Importing all enemy data

with open('Enemy Data/BaseData.json') as json_file:
    basedata = json.loads(json_file.read())

with open('Localization\GenseiName\en-US\GenseiName.json') as json_file:
    genseiname = json.loads(json_file.read())

with open('Localization\GenseiFamilyName\en-US\GenseiFamilyName.json') as json_file:
    genseifamilyname = json.loads(json_file.read())

with open('Localization\GenseiScientificName_Picturebook\en-US\GenseiScientificName_Picturebook.json') as json_file:
    genseiscientificname = json.loads(json_file.read())

with open('Localization\GenseiDesc\en-US\GenseiDesc.json') as json_file:
    genseidesc = json.loads(json_file.read())

with open('Localization\GenseiDescLouie\en-US\GenseiDescLouie.json') as json_file:
    genseidesclouie = json.loads(json_file.read())

with open('Localization\GenseiDescOlimar\en-US\GenseiDescOlimar.json') as json_file:
    genseidescolimar = json.loads(json_file.read())

def get_enemy_data():

    #Grab all the data about all creatures

    data_list = []

    for enemy in genseiname['GenseiName']:
        enemy_dict = {"Internal name": enemy}
        enemy_dict["Name"] = genseiname['GenseiName'][enemy].split(']')[-1]
        enemy_dict['Scientific name'] = genseiscientificname['GenseiScientificName_Picturebook'][enemy.replace('_00', '').replace('_01', '')].split(']')[-1]
        enemy_dict['Family'] = genseifamilyname['GenseiFamilyName'][enemy.replace('_00', '').replace('_01', '')].split(']')[-1]
        if enemy in basedata[0]['Rows']:
            enemy_dict['ActorName'] = basedata[0]['Rows'][enemy]['ActorName']
            enemy_dict['Weight'] = basedata[0]['Rows'][enemy]['CarryWeightMin']
            enemy_dict['Carry Max'] = basedata[0]['Rows'][enemy]['CarryWeightMax']
            enemy_dict['MaxLife'] = basedata[0]['Rows'][enemy]['MaxLife']
            enemy_dict['Sparklium'] = basedata[0]['Rows'][enemy]['Kira']
            # enemy_dict['Challenge Points'] = basedata[0]['Rows'][enemy]['CarryWeightMin']
            # enemy_dict['Battle Points'] = basedata[0]['Rows'][enemy]['CarryWeightMin']
            enemy_dict['Pikmin Seeds'] = basedata[0]['Rows'][enemy]['CarryIncPikmins']
            enemy_dict['Player Damage'] = basedata[0]['Rows'][enemy]['PlayerDamage']
            enemy_dict['Other Damage'] = basedata[0]['Rows'][enemy]['OtherDamage']
            enemy_dict['Starbit amount'] = basedata[0]['Rows'][enemy]['DropStationPieceNum']
        enemy_dict['Description'] = genseidesc['GenseiDesc'][enemy.replace('_00', '').replace('_01', '')].split(']')[-1]
        enemy_dict['Louie Desc.'] = genseidesclouie['GenseiDescLouie'][enemy.replace('_00', '').replace('_01', '')].split(']')[-1]
        enemy_dict['Olimar Desc.'] = genseidescolimar['GenseiDescOlimar'][enemy.replace('_00', '').replace('_01', '')].split(']')[-1]

        data_list.append(enemy_dict)

    return data_list

with open('Ready for spreadsheet/Enemy_data.json', 'w') as json_file:
    json_file.write(json.dumps(get_enemy_data(), indent = 2))
