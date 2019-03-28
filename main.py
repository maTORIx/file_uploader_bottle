import os
import argparse
from bottle import Bottle, run, template

app = Bottle()

@app.route("/")
def index():
    return template("./templates/index.html")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', type=str, default='localhost')
    parser.add_argument('--port', type=int, default=8000)
    
    args = parser.parse_args()
    run(app=app, host=args.host, port=args.port)

if __name__ == '__main__':
    main()