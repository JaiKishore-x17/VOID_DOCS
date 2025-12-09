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

def Discover_New_Peers():
    while True:
        dax = Listen()
        print(dax)
        ip , data = dax[0] , dax[1]
        print(ip)
        if data == "Add_Me" and ip not in current_connected_peers :
            current_connected_peers += [ip]
            Send(ip,"Added_You")

def Remove_Offline_Peers(current_connected_peers):
    while True:
        for i in current_connected_peers:
            dax = Send(i,"Online_Check")
            dab = Listen(i)
            if dab != "Add_Me":
                current_connected_peers.remove(i)

def Run():
    current_connected_peers = []

    Adder = threading.Thread(target = Discover_New_Peers)
    Remover = threading.Thread(target = Remove_Offline_Peers,args=(current_connected_peers,))
    Adder.start()
    Remover.start()

thread = threading.Thread(target=Run)
thread.start()