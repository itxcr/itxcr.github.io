# import pandas
# import pymongo
#
# user_name = 'xcr01'
# user_pwd = 'dagongren'
# host = 'www.atlantide.top'
# port = 60001
# db_name = 'dagongren'
# client = pymongo.MongoClient(
#     "mongodb://{username}:{password}@{host}:{port}/{db_name}".format(username=user_name, password=user_pwd, host=host,
#                                                                      port=port,
#                                                                      db_name=db_name))
# mydb = client['dagongren']
# mycol = mydb['tianjin_all_urls']
# col_data = list(mycol.find({}, {'url': 1, '_id': 0}))
# for i in col_data:
#     print(i['url'])

# all = [1, 2, 3]
# exit = [2, 3, 4]
# print(list(set(all).difference(set(exit))))