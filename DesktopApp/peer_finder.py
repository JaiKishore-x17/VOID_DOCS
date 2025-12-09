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
        self.message_history = []  # Track recent messages
    
    def broadcast(self, msg, sender_ip=None, sender_id=None):
        """Broadcast message to ALL peers"""
        broadcast_data = {
            "node_id": sender_id or self.server_id,
            "sender_ip": sender_ip,
            "msg": msg,
            "timestamp": time.time()
        }
        
        for ip in list(self.peers.keys()):
            self.send(ip, broadcast_data)
    
    def send(self, ip, msg_data):
        """Send to specific peer"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(3)
            sock.connect((ip, self.port))
            sock.sendall(json.dumps(msg_data).encode())
            sock.close()
        except:
            print(f"[SERVER] Failed to send to {ip}")
    
    def listen(self):
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
        ip = addr[0]
        try:
            data = conn.recv(4096).decode()
            msg_data = json.loads(data)
            sender_id = msg_data.get("node_id")
            msg = msg_data.get("msg")
            sender_ip = msg_data.get("sender_ip", ip)
            
            print(f"[{self.server_id}] {sender_id}@{ip}: {msg}")
            
            # Handle control messages
            if msg == "Add_Me":
                self.peers[ip] = {"node_id": sender_id, "last_seen": time.time()}
                print(f"[{self.server_id}] ✅ Added {sender_id}@{ip}")
                conn.sendall(json.dumps({"node_id": self.server_id, "msg": "Added_You"}).encode())
                self.broadcast(f"🔔 {sender_id} joined the network!", ip, sender_id)
                return
            
            elif msg == "Online_Check":
                if ip in self.peers:
                    self.peers[ip]["last_seen"] = time.time()
                conn.sendall(json.dumps({"node_id": self.server_id, "msg": "Im_Online"}).encode())
                return
            
            # BROADCAST ALL OTHER MESSAGES TO EVERYONE
            self.broadcast(msg, ip, sender_id)
            
        except Exception as e:
            print(f"[SERVER] Connection error from {ip}: {e}")
        finally:
            conn.close()
    
    def cleanup_offline(self):
        while self.is_running:
            current_time = time.time()
            offline_peers = []
            for ip, info in self.peers.items():
                if current_time - info["last_seen"] > 90:
                    offline_peers.append(ip)
            
            for ip in offline_peers:
                node_id = self.peers[ip]["node_id"]
                del self.peers[ip]
                self.broadcast(f"❌ {node_id} disconnected")
                print(f"[{self.server_id}] Removed offline: {node_id}@{ip}")
            
            time.sleep(60)
    
    def status(self):
        while self.is_running:
            print(f"\n[{self.server_id}] 🌐 Network ({len(self.peers)} nodes):")
            for ip, info in self.peers.items():
                print(f"  • {info['node_id']}@{ip}")
            time.sleep(20)
    
    def start(self):
        self.is_running = True
        threading.Thread(target=self.listen, daemon=True).start()
        threading.Thread(target=self.cleanup_offline, daemon=True).start()
        threading.Thread(target=self.status, daemon=True).start()
        print(f"[{self.server_id}] 🚀 Broadcast Server Started!")

if __name__ == "__main__":
    server = P2PServer()
    server.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        server.is_running = False
