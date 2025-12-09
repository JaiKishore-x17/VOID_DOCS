import socket
import threading
import time
import json

class P2PClient:
    def __init__(self, server_ip):
        self.server_ip = server_ip
        self.server_port = 5000
        self.peers = []
        self.is_running = False
        self.node_id = f"{socket.gethostname()}_{int(time.time())}"
        
    def send(self, ip, msg):
        """Send message to specific IP"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(3)
            sock.connect((ip, self.server_port))
            sock.sendall(json.dumps({"node_id": self.node_id, "msg": msg}).encode())
            sock.close()
            return True
        except:
            return False
    
    def listen(self):
        """Listen for incoming connections"""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('0.0.0.0', self.server_port))
        sock.listen(5)
        print(f"[{self.node_id}] Listening on port {self.server_port}")
        
        while self.is_running:
            try:
                conn, addr = sock.accept()
                threading.Thread(target=self.handle_connection, args=(conn, addr), daemon=True).start()
            except:
                break
        sock.close()
    
    def handle_connection(self, conn, addr):
        """Handle single connection"""
        try:
            data = conn.recv(1024).decode()
            msg_data = json.loads(data)
            sender_id = msg_data.get("node_id")
            msg = msg_data.get("msg")
            
            print(f"[{self.node_id}] Received from {addr}: {msg}")
            
            if msg == "Add_Me":
                self.peers.append(addr[0])
                print(f"[{self.node_id}] Added peer: {addr[0]}")
                conn.sendall(json.dumps({"node_id": self.node_id, "msg": "Added_You"}).encode())
            
            elif msg == "Online_Check":
                conn.sendall(json.dumps({"node_id": self.node_id, "msg": "Im_Online"}).encode())
                
        except:
            pass
        finally:
            conn.close()
    
    def first_connect(self):
        """Connect to server and get added"""
        print(f"[{self.node_id}] Connecting to server {self.server_ip}")
        for _ in range(10):  # Retry 10 times
            if self.send(self.server_ip, "Add_Me"):
                time.sleep(1)
                break
            time.sleep(2)
    
    def heartbeat(self):
        """Send heartbeat to server"""
        while self.is_running:
            self.send(self.server_ip, "Online_Check")
            time.sleep(30)  # Every 30 seconds
    
    def start(self):
        self.is_running = True
        threading.Thread(target=self.listen, daemon=True).start()
        threading.Thread(target=self.first_connect, daemon=True).start()
        threading.Thread(target=self.heartbeat, daemon=True).start()
        print(f"[{self.node_id}] Client started")

# Usage
if __name__ == "__main__":
    client = P2PClient("172.16.44.187")  # Server IP
    client.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        client.is_running = False


