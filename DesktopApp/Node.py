import socket
import threading
import time
import json

# FIXED SERVER IP - No input needed!
SERVER_IP = "172.16.44.187"

class P2PClient:
    def __init__(self, server_ip=SERVER_IP, node_name=None):
        self.server_ip = server_ip
        self.server_port = 5000
        self.node_id = node_name or f"Node_{socket.gethostname()}_{int(time.time())}"
        self.peers = []
        self.is_running = False
        
    def send(self, msg_data):
        """Send message to server (gets broadcast to all)"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            sock.connect((self.server_ip, self.server_port))
            sock.sendall(json.dumps(msg_data).encode())
            sock.close()
            return True
        except Exception as e:
            print(f"[{self.node_id}] [ERROR] Send failed: {e}")
            return False
    
    def listen(self):
        """Listen for incoming broadcast messages"""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('0.0.0.0', self.server_port))
        sock.listen(10)
        print(f"[{self.node_id}] 📡 Listening on port {self.server_port}")
        
        while self.is_running:
            try:
                conn, addr = sock.accept()
                threading.Thread(target=self.handle_broadcast, args=(conn, addr), daemon=True).start()
            except:
                if self.is_running:
                    time.sleep(1)
    
    def handle_broadcast(self, conn, addr):
        """Handle incoming broadcast message"""
        try:
            data = conn.recv(4096).decode()
            msg_data = json.loads(data)
            sender_id = msg_data.get("node_id")
            sender_ip = msg_data.get("sender_ip")
            msg = msg_data.get("msg")
            
            # Skip own messages and server control messages
            if sender_id == self.node_id or sender_id == "SERVER":
                return
            
            print(f"\n📨 [{self.node_id}] <- {sender_id}@{sender_ip}: {msg}")
            
        except:
            pass
        finally:
            conn.close()
    
    def first_connect(self):
        """Register with server"""
        print(f"[{self.node_id}] 🔗 Connecting to {self.server_ip}...")
        for attempt in range(15):
            if self.send({"node_id": self.node_id, "msg": "Add_Me"}):
                print(f"[{self.node_id}] ✅ Connected to network!")
                return True
            print(f"[{self.node_id}] 🔄 Retry {attempt+1}/15...")
            time.sleep(2)
        print(f"[{self.node_id}] ❌ Failed to connect to server!")
        return False
    
    def heartbeat(self):
        """Keep alive"""
        while self.is_running:
            self.send({"node_id": self.node_id, "msg": "Online_Check"})
            time.sleep(30)
    
    def interactive_chat(self):
        """Command line chat"""
        print(f"\n[{self.node_id}] 💬 Chat ready! Type messages (or 'quit'):")
        while self.is_running:
            try:
                msg = input(f"[{self.node_id}] > ").strip()
                if msg.lower() == 'quit':
                    break
                if msg:
                    self.send({"node_id": self.node_id, "msg": msg})
            except KeyboardInterrupt:
                break
    
    def start(self):
        self.is_running = True
        
        # Start listener first
        threading.Thread(target=self.listen, daemon=True).start()
        time.sleep(1)
        
        # Connect to server
        if not self.first_connect():
            return
        
        # Start heartbeat
        threading.Thread(target=self.heartbeat, daemon=True).start()
        
        # Start chat
        self.interactive_chat()
        
        self.is_running = False

# ONE-LINE START - FIXED IP
if __name__ == "__main__":
    print("🌐 P2P Chat Node")
    print(f"📡 Auto-connecting to FIXED SERVER: {SERVER_IP}:5000")
    print("=" * 50)
    
    client = P2PClient()  # Uses fixed IP automatically
    client.start()
