import hashlib
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes

def sha256_hasher(file_storage):
    sha256 = hashlib.sha256()
    file_storage.stream.seek(0)

    for chunk in iter(lambda: file_storage.stream.read(4096), b''):
        sha256.update(chunk)

    file_storage.stream.seek(0)
    return sha256.hexdigest()

def generate_rsa_keypair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )

    public_key = private_key.public_key()
    pem_private = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    pem_public = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    private_key = pem_private.decode()
    public_key = pem_public.decode()

    return [private_key, public_key]

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