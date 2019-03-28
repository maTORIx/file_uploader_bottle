import os
import argparse
from bottle import Bottle, run
from bottle import template, static_file

from api import api

app = Bottle()
STATIC_FILES_DIR = './static_files'

@app.route("/")
def index():
    return template("./templates/index.html")

@app.route('/static_files/<file_path:path>')
def static_files(file_path):
    return static_file(file_path, STATIC_FILES_DIR)

app.mount('/api', api)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', type=str, default='localhost')
    parser.add_argument('--port', type=int, default=8000)
    
    args = parser.parse_args()
    run(app=app, host=args.host, port=args.port, reloader=True)

if __name__ == '__main__':
    main()