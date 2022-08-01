from flask import jsonify,request
from app.api import bp

@bp.route('/ping', methods=['GET'])
def ping():
    request
    return jsonify('Pong!')

@bp.route('/menus', methods=['GET'])
def menus():
    menus = [
        {
            "path": "/welcome",
            "name": "welcome"
        }
    ]
    return jsonify(menus)