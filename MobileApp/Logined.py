from pymongo import MongoClient
import bcrypt

def logined(user_id, user_pass, x):
    # Connect to MongoDB using the provided connection string
    client = MongoClient(x)
    db = client["VOID-Docs"]
    Users_ID = db["Users_ID"]
    
    # Search for the user document with the given user ID
    User_record = Users_ID.find_one({"ID": user_id})

    # If no user is found, return error message
    if User_record is None:
        return ["No admin found with that ID.", False]

    # Retrieve the stored hashed password from the database
    stored_hash = User_record.get("ID_Passwd").encode('utf-8')

    # Compare the entered password with the stored hash using bcrypt
    if bcrypt.checkpw(user_pass.encode('utf-8'), stored_hash):
        # If the password matches, login is successful
        return ["Account Logged In.", True]
    else:
        # If password check fails, login is denied
        return ["Account Login Failed.", False]
