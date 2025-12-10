import socket
import threading
import time
import json

class P2PServer:
    def __init__(self):
        self.port = 5000
        self.peers = {}  # {ip: {"node_id": str, "last_seen": float}}
        self.is_running = False
        self.server_id = "SERVER"
    
    def broadcast(self, msg):
        """Send message to all peers"""
        for ip in list(self.peers.keys()):
            self.send(ip, msg)
    
    def send(self, ip, msg):
        """Send to specific peer"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(3)
            sock.connect((ip, self.port))
            sock.sendall(json.dumps({"node_id": self.server_id, "msg": msg}).encode())
            sock.close()
        except:
            pass
    
    def listen(self):
        """Main server listener"""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('0.0.0.0', self.port))
        sock.listen(10)
        print(f"[{self.server_id}] Server listening on port {self.port}")
        
        while self.is_running:
            try:
                conn, addr = sock.accept()
                threading.Thread(target=self.handle_connection, args=(conn, addr), daemon=True).start()
            except:
                break
        sock.close()
    
    def handle_connection(self, conn, addr):
        """Handle incoming connection"""
        ip = addr[0]
        try:
            data = conn.recv(1024).decode()
            msg_data = json.loads(data)
            sender_id = msg_data.get("node_id")
            msg = msg_data.get("msg")
            
            print(f"[{self.server_id}] {ip} says: {msg}")
            
            if msg == "Add_Me":
                self.peers[ip] = {"node_id": sender_id, "last_seen": time.time()}
                print(f"[{self.server_id}] Added {ip} ({sender_id})")
                conn.sendall(json.dumps({"node_id": self.server_id, "msg": "Added_You"}).encode())
                self.broadcast(f"New peer joined: {ip}")
            
            elif msg == "Online_Check":
                if ip in self.peers:
                    self.peers[ip]["last_seen"] = time.time()
                conn.sendall(json.dumps({"node_id": self.server_id, "msg": "Im_Online"}).encode())
                
        except:
            pass
        finally:
            conn.close()
    
    def cleanup_offline(self):
        """Remove offline peers"""
        while self.is_running:
            current_time = time.time()
            offline_peers = []
            for ip, info in self.peers.items():
                if current_time - info["last_seen"] > 90:  # 90s timeout
                    offline_peers.append(ip)
            
            for ip in offline_peers:
                del self.peers[ip]
                print(f"[{self.server_id}] Removed offline peer: {ip}")
            
            time.sleep(60)  # Check every minute
    
    def status(self):
        """Print peer status"""
        while self.is_running:
            print(f"\n[{self.server_id}] Active peers ({len(self.peers)}):")
            for ip, info in self.peers.items():
                print(f"  - {ip} ({info['node_id']})")
            time.sleep(30)
    
    def start(self):
        self.is_running = True
        threading.Thread(target=self.listen, daemon=True).start()
        threading.Thread(target=self.cleanup_offline, daemon=True).start()
        threading.Thread(target=self.status, daemon=True).start()
        print(f"[{self.server_id}] Server started")

# Usage
if __name__ == "__main__":
    server = P2PServer()
    server.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        server.is_running = False
    