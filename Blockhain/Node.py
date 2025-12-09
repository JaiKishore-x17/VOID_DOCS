import socket
import threading

def Listen():
    server_ip = '0.0.0.0'
    server_port = 5000  # pick an open port
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((server_ip, server_port))
    server_socket.listen(1)
    print(f"Listening on {server_ip}:{server_port}...")

    conn, addr = server_socket.accept()
    print(f"Connection from {addr}")

    data = conn.recv(1024)
    conn.close()
    server_socket.close()
    return [addr,data]

def Send(ip,msg):
    server_ip = ip
    server_port = 5000
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_ip, server_port))
    client_socket.sendall(msg.encode())
    client_socket.close()

def First_Connect(ip):
    while True:
        a = Send(ip,"Add_Me")
        b = Listen()
        if b[0] == ip and b[1] == "Added_You":
            break
        else:
            continue

def Stay_Connected(ip):
    while True:
        b = Listen()
        if b[0] == ip and b[1] == "Online_Check":
            Send(ip, "Add_Me")
        else:
            continue

def Run(ip):
    First_Connect(ip)
    thread = threading.Thread(target=Stay_Connected, args=(ip))
    thread.start()


ip_input = "172.16.44.251"
thread = threading.Thread(target=Run, args=(ip_input,))
thread.start()