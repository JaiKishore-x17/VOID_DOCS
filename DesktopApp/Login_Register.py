from pymongo import MongoClient
import bcrypt
from Encrypt_Decrypt import generate_rsa_keypair

def registeration(name, user_id, user_pass, x):
    client = MongoClient(x)

    db = client["VOID-Docs"]
    Admins_ID = db["Admins_ID"]
    Admins_Public = db["Admins_Public"]

    existing_user = Admins_ID.find_one({"ID": user_id})

    if existing_user is None:
        hashed_password = bcrypt.hashpw(user_pass.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        Admins_ID.insert_one({"ID": user_id, "ID_Passwd": hashed_password})

        keys = generate_rsa_keypair()

        Admins_Public.insert_one({
            "Public_Key": keys[1],
            "ID": user_id,
            "Name": name
        })

        return ["Registration Successful.", True, keys[0]]

    else:
        return ["Admin ID already in use.", False]

def logined(user_id, user_pass, x):
    client = MongoClient(x)
    db = client["VOID-Docs"]
    Admins_ID = db["Admins_ID"]
    
    Admin_record = Admins_ID.find_one({"ID": user_id})

    if Admin_record is None:
        return ["No admin found with that ID.", False]

    stored_hash =Admin_record.get("ID_Passwd").encode('utf-8')

    if bcrypt.checkpw(user_pass.encode('utf-8'), stored_hash):
        return ["Account Logged In.", True]
    else:
        return ["Account Login Failed.", False]
