from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from dontcommit import MongoDB, flask
from Login_Register import logined , registeration
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.secret_key = flask

x = MongoDB

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('Home'))
    else:
        return render_template('index.html')


@app.route('/Login_Page', methods=['POST', 'GET'])
def Login_Page():
    return render_template('Login.html')


@app.route('/Register_Page', methods=['POST', 'GET'])
def Register_Page():
    return render_template('Register.html')


@app.route('/Login_Admin', methods=['GET', 'POST'])
def Login_Admin():
    if request.method == 'POST':
        user_id = request.form['user_id']
        user_pass = request.form['password']
        m = logined(user_id, user_pass, x)
        msg = m[0]
        Login_status = m[1]

        if Login_status:
            session['user_id'] = user_id
            return render_template('Home.html')
        else:
            return render_template('Login.html', message=msg)
    
    return render_template('Login.html')


@app.route('/Register_Admin', methods=['GET', 'POST'])
def Register_Admin():
    message = "" 
    
    if request.method == 'POST':
        
        name = request.form['name']
        user_id = request.form['user_id']
        user_pass = request.form['password']

        m = registeration(name, user_id, user_pass, x)
        msg = m[0]
        Register_status = m[1]

        if Register_status:
            session['user_id'] = user_id
            return render_template('Home.html')
        else:
            return render_template('Register.html', message=msg) 
    
    return render_template('Register.html')


@app.route('/Home')
def Home():
    if 'user_id' not in session:
        return redirect(url_for('Login_Page'))
    return render_template('Home.html')


@app.route("/add_auth_user/<user_id>", methods=["GET"])
def get_user(user_id):
    from pymongo import MongoClient
    
    client = MongoClient(x)
    db = client["VOID-Docs"]
    User_Public = db["Users_Public"]

    user = User_Public.find_one({"ID": user_id})
    if user is None:
        return jsonify({"error": "User not found in database."}), 404

    name = user.get("Name")
    key = user.get("Public_Key")
    user = {"name":name, "publicKey":key}
    print(1  )
    return jsonify(user)


@app.route('/Download', methods=['POST','GET'])
def download_file(file_id, output_folder, collection):
    from bson import ObjectId

    try:
        # Ensure file_id is an ObjectId
        if isinstance(file_id, str):
            file_id = ObjectId(file_id)

        # Fetch document
        doc = collection.find_one({'_id': file_id})
        if not doc:
            return "File not found in MongoDB."

        filename = doc.get('filename', 'restored_file')
        file_data = doc.get('file_data')

        if not file_data:
            return "No file data found in document."

        # Save to disk
        output_path = os.path.join(output_folder, filename)
        with open(output_path, 'wb') as f:
            f.write(file_data)

        return f"File restored to: {output_path}"

    except Exception as e:
        return f"Error: {str(e)}"


@app.route('/upload', methods=['POST'])
def upload_file():
    UPLOAD_FOLDER = 'uploads'
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # "file" must match formData.append('file', ...)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    f = request.files['file']
    if f.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(f.filename)
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    f.save(save_path)  # or process in-memory via f.read()

    return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200


@app.route('/Logout')
def Logout():
    session.pop('user_id', None)
    return redirect(url_for('Login_Page'))


if __name__ == '__main__':
    app.run(debug=True)