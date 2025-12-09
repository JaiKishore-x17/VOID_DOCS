<div align="center" style="background:#000; padding:30px; border-radius:15px;">
  <img src="LOGO_URL_HERE" alt="VOID DOCS Logo" width="220"/>
  <h1> VOID DOCS</h1>
  <h3><i>Secure | Decentralized | Intelligent Document Verification</i></h3>
  <b>Built with Flask | Python | MongoDB | AWS | Akari Blockchain | Gemini AI</b>
  <div align="center">

  ![Python](https://img.shields.io/badge/Python-3.10-blue)
  ![Flask](https://img.shields.io/badge/Flask-Backend-lightgrey)
  ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
  ![AWS](https://img.shields.io/badge/Cloud-AWS-orange)
  ![Hackathon](https://img.shields.io/badge/Event-Hackathon-red)
  
  </div>
</div>
<div align="center">
  <img src="https://www.vectorlogo.zone/logos/python/python-icon.svg" width="60" />
  <img src="https://www.vectorlogo.zone/logos/palletsprojects_flask/palletsprojects_flask-icon~v2.svg" width="60" />
  <img src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" width="60" />
  <img src="https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg" width="60" />
  <img src="https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg" width="60" />
  <img src="https://www.vectorlogo.zone/logos/javascript/javascript-icon.svg" width="60" />
  <img src="https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg" width="60" />
</div>

 
---

---

<div align="center" style="background:#000; padding:20px; border-radius:12px; border:1px solid #ff3c3c;">

<h2 style="color:#ff3c3c;">🚨 Problem Statement</h2>

<p style="font-size:16px; color:#ddd; max-width:800px; text-align:center; line-height:1.6;">
India’s document management systems still rely on centralized verification models,
leading to <b>forgery, tampering, delays, and massive data leaks.</b><br><br>
<b style="color:#ff3c3c;">VOID DOCS</b> introduces a next-generation framework that
combines <b>Blockchain immutability</b> with <b>AI intelligence</b> to create
a secure, decentralized, and instantly verifiable record system — ensuring
<b>authenticity, privacy, and trust</b> in every document transaction.
</p>

</div>

---
---

---

<div align="center" style="background:#000; padding:20px; border-radius:12px; border:1px solid #ff3c3c;">
<h2 style="color:#ff3c3c;">⚙️ Core Features</h2>
</div>

<ul style="font-size:16px; color:#ddd; line-height:1.7;">

<li><b style="color:#ff3c3c;">🧱 Akari Blockchain:</b>  
Every document is converted into a <b>unique SHA-256 hash</b> and stored on Akari — ensuring tamper-proof verification and permanent traceability.</li>

<li><b style="color:#ff3c3c;">🧠 Gemini AI Integration:</b>  
Gemini enhances document processing through <b>intelligent tagging</b>, metadata extraction, and Q-A-based content assistance — all while preserving data privacy.</li>

<li><b style="color:#ff3c3c;">☁️ AWS Cloud Deployment:</b>  
VOID DOCS uses <b>Amazon S3</b> for secure file storage and <b>EC2</b> for scalable backend hosting — ensuring availability, encryption, and reliability.</li>

<li><b style="color:#ff3c3c;">⚡ Fast Verification:</b>  
Hash-based verification allows instant document validation without re-uploading the file — reducing verification time to seconds.</li>

<li><b style="color:#ff3c3c;">🧩 Modular Flask + MongoDB Backend:</b>  
Our backend uses <b>Flask APIs</b> for logic and <b>MongoDB</b> for structured metadata — a flexible, scalable foundation for expansion and AI integration.</li>

</ul>

---  

---

---

## 🧩 System Architecture

```mermaid
flowchart TD
    A[UserInterface] --> B[Flask API Layer<br/>Handles uploads & authentication]
    B --> C[Akari Blockchain<br/>Stores SHA-256 hashes & timestamps]
    C --> D[AWS (S3 + EC2) + MongoDB<br/>Encrypted storage & scalability]
    D --> E[Gemini AI Module<br/>Performs metadata extraction, tagging & Q&A]

## ´ Core Modules  
**Akari Blockchain:** Lightweight blockchain storing only file hashes & timestamps â€” ensures tamper-proof verification.  
**Gemini AI:** AI module for document summarization, metadata extraction & question answering.  
**AWS Integration:** S3 for encrypted file storage, EC2 for backend hosting, IAM for access control.  

---

## ´ Team Akatsuki  
| Name | Role | Email |
|------|------|-------|
| Jai Kishore N H | Team Head | jaikishore.n2025@vitstudent.ac.in |
| Lalith Adhithiya Saravanan | Backend Lead | lalith.adhithya2025@vitstudent.ac.in |
| Fawwaz Ahamed F | Frontend & AI | fawwazahamed.f2025@vitstudent.ac.in |
| Joash Mathew Jiju | Cloud & Blockchain | joash.mathewjiju2025@vitstudent.ac.in |

---

## 🔴 Why We Used Blockchain (Akari)

We implemented our own blockchain system — **Akari** — to make document verification **trustless, transparent, and tamper-proof**.

Traditional document systems rely on centralized databases that can be:
- Altered or deleted by insiders  
- Compromised by unauthorized access  
- Lost due to server or storage failure  

**Blockchain fixes this by design:**

| Problem | Blockchain Solution |
|----------|--------------------|
| Document forgery or alteration | Each file’s hash is stored in a block — tampering changes the hash, instantly detected. |
| Centralized trust issues | Distributed ledger — verification doesn’t rely on any single authority. |
| Lack of authenticity proof | Time-stamped, cryptographically linked blocks provide verifiable record history. |
| Data loss or corruption | Redundant ledger across nodes ensures persistence and recovery. |

**Akari Blockchain** stores:
- Document hash (SHA-256)  
- Timestamp  
- Owner metadata  
- Previous block hash  

This guarantees **immutability, transparency, and verification** — without storing the actual document, protecting privacy.

> ✅ **In short:** Blockchain removes forgery, builds trust, eliminates intermediaries, and keeps records permanently verifiable.

---


