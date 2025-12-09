import hashlib
import time
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
import os

# ---------------------------------------------
# Clears the terminal screen (cross-platform)
# ---------------------------------------------
def clear():
    if os.name == 'nt':       # For Windows
        os.system('cls')
    else:                     # For macOS/Linux
        os.system('clear')


# ---------------------------------------------
# Returns SHA-256 hash of the given data
# ---------------------------------------------
def sha256_hasher(data):
    if isinstance(data, str):
        data = data.encode('utf-8')  # Convert string to bytes
    
    hash_object = hashlib.sha256(data)
    return hash_object.hexdigest()   # Return hex representation of the hash


# ---------------------------------------------
# Generates a new RSA key pair (private + public)
# ---------------------------------------------
def generate_rsa_keypair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,  # Standard exponent for RSA
        key_size=2048           # Key length (bits)
    )

    public_key = private_key.public_key()

    # Convert private key to PEM format (readable text format)
    pem_private = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    # Convert public key to PEM format
    pem_public = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    # Decode bytes to strings for easier storage or transport
    return [pem_private.decode(), pem_public.decode()]


# ---------------------------------------------
# Encrypts data using the PRIVATE key
# (Note: Normally, private key is used for signing, not encryption)
# ---------------------------------------------
def encrypt_with_private_key(private_key, plaintext):
    ciphertext = private_key.encrypt(
        plaintext.encode('utf-8'),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()), 
            algorithm=hashes.SHA256(), 
            label=None
        )
    )
    return ciphertext


# ---------------------------------------------
# Decrypts data using the PUBLIC key
# (Note: Normally, public key is used for verification, not decryption)
# ---------------------------------------------
def decrypt_with_public_key(public_key, ciphertext):
    plaintext = public_key.decrypt(
        ciphertext,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()), 
            algorithm=hashes.SHA256(), 
            label=None
        )
    )
    return plaintext.decode('utf-8')


# ---------------------------------------------
# Adds a new block to the blockchain file
# ---------------------------------------------
def block_adder(block_data):
    # Open blockchain file and load existing data
    with open("Blockchain.txt", "r") as file:
        chain = eval(file.read())  # Convert string back to Python list/dict

    # Get hash of the last block to link the chain
    previous_block = chain[-1]
    hash_previous_block = sha256_hasher(str(previous_block))

    # Create new block with timestamp and previous hash reference
    new_block = {
        "previous_hash": hash_previous_block,
        "time_stamp": time.time(),
        "data": block_data
    }

    # Append the new block and write back to file
    chain.append(new_block)
    with open("Blockchain.txt", "w") as file:
        file.write(str(chain))
