'''

Block_Data = { Admin: {admin: PublicKey},
             Users: {user1: PublicKey, user2: PublicKey, ..},
             File: [hash, data]
             Admin_Sign: hash_sign,
             Users_Sign: {user1: sign_hash, user2: sign_hash, ..}
             Time: timestamp}

'''

from dontcommit import MongoDB, flask
from pymongo import MongoClient
from Encrypt_Decrypt import sha256_hasher, decrypt_with_public_key

x = MongoDB
client = MongoClient(x)
db = client["VOID-Docs"]
Users_Public = db["Users_Public"]
Admins_Public = db["Admins_Public"]
    

def verify_Block(Block_Data):

    Admin = list(Block_Data['Admin'])
    Adm_finder = Admins_Public.find_one({"ID": Admin[0], "Public_Key": Admin[1]})
    
    if Adm_finder == None:
        ver = [False]

    users = Block_Data['Users']

    for i in users:
        User_finder = Users_Public.find_one({"ID": i, "Public_Key": users[i]})
        if User_finder == None:
            ver += [False]

    filer = Block_Data['File']
    if sha256_hasher(filer[1]) != filer[0]:
        ver += [False]

    if False not in ver:

        for i in Block_Data['User_Sign']:
            if filer[0] != decrypt_with_public_key(users[i],Block_Data['User_Sign'][i]):
                ver += [False]

        if filer[0] != decrypt_with_public_key(Admin[1],Block_Data['Admin_Sign']):
            ver += [False] 

    if False not in ver:
        return True
    else:
        return False

def Add_Block(Block_Data):
    
    Block_file = open("BlockChain.txt",'r')
    BlockChain = eval(Block_file.read())

    previous_Block = BlockChain[-1]
    Previous_Hash = sha256_hasher(previous_Block)
    Block_No = previous_Block['Block_No']+1

    if verify_Block(Block_Data) == True:
        Block = {'Block_No': Block_No, 'Previous_Hash': Previous_Hash, 'Block': Block_Data}
        New_Chain = BlockChain.append(Block)
        a = open("BlockChain.txt", "w")
        a.write(str(New_Chain))
        a.close()
        return "Addition of Block Successfull"
    else:
        return "Block does not pass verification."