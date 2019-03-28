import os
import sys
import uuid
import json

from bottle import Bottle, request
from bottle import static_file, redirect, abort

api = Bottle()
UPLOADED_FILES_PATH = './uploaded_files'
MAX_FILESIZE = 1024 * 1024 * 5 # 5MB

def save_file(data):
    uid = uuid.uuid4()
    filename = '{}_{}'.format(uid, data.filename)
    save_path = os.path.join(UPLOADED_FILES_PATH, filename)
    data.save(save_path)
    return filename


@api.route('/files')
def api_files():
    files = os.listdir(UPLOADED_FILES_PATH)
    result = {
        'files': files
    }
    return json.dumps(result)


@api.route('/files', method='POST')
def api_files_post():
    data = request.files.get('data')
    if data and data.file and sys.getsizeof(data.file) < MAX_FILESIZE:
        filename = save_file(data)
        result = {'uploaded_file': filename}
        return json.dumps(result)
    
    abort(code=500, text='File not found or too long.')
    return
    

@api.route('/files/<file_path:path>')
def api_download_file(file_path):
    return static_file(file_path, UPLOADED_FILES_PATH, download=True)

