import re
from datetime import datetime
from flask import request, jsonify, url_for, current_app, g
from app.extensions import db
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import bad_request
from app.models import User, Post


@bp.route('/users', methods=['POST'])
def create_user():
    '''注册一个用户'''

    data = request.get_json()
    if not data:
        return bad_request('you must post ')
    message = {}
    if 'username' not in data or not data.get('username', None):
        message['username'] = 'Please provide a valid username.'
    pattern = '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
    if 'email' not in data or not re.match(pattern, data.get('email', None)):
        message['email'] = 'Please provide a valid email address.'
    if 'password' not in data or not data.get('password', None):
        message['password'] = 'Please provide a valid password.'

    if User.query.filter_by(username=data.get('username', None)).first():
        message['username'] = 'Please use a different username.'
    if User.query.filter_by(email=data.get('email', None)).first():
        message['email'] = 'Please use a different email address.'
    if message:
        return bad_request(message)

    user = User()
    user.from_dict(data, new_user=True)
    db.session.add(user)
    db.session.commit()
    response = jsonify(user.to_dict())
    response.status_code = 201
    # HTTP协议要求201响应包含一个值为新资源URL的Location头部
    response.headers['Location'] = url_for('api.get_user', id=user.id)
    return response


@bp.route('/users', methods=['GET'])
@token_auth.login_required
def get_users():
    """返回所有用户的集合"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(User.query, page, per_page, 'api.get_users')
    return jsonify(data)


@bp.route('/users/<int:id>', methods=['GET'])
@token_auth.login_required
def get_user(id):
    """返回一个用户"""
    user = User.query.get_or_404(id)
    if g.current_user == user:
        return jsonify(user.to_dict(include_email=True))
    data = user.to_dict()
    data['is_following'] = g.current_user.is_following(user)
    return jsonify(data)


@bp.route('/users/<int:id>', methods=['PUT'])
@token_auth.login_required
def updata_user(id):
    """修改一个用户"""
    user = User.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return bad_request('You must post JSON data.')

    message = {}
    if 'username' in data and not data.get('username', None):
        message['username'] = 'Please provide a valid username.'

    pattern = '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
    if 'email' in data and not re.match(pattern, data.get('email', None)):
        message['email'] = 'Please provide a valid email address.'

    if 'username' in data and data['username'] != user.username and \
            User.query.filter_by(username=data['username']).first():
        message['username'] = 'Please use a different username.'
    if 'email' in data and data['email'] != user.email and \
            User.query.filter_by(email=data['email']).first():
        message['email'] = 'Please use a different email address.'

    if message:
        return bad_request(message)

    user.from_dict(data, new_user=False)
    db.session.commit()
    return jsonify(user.to_dict())


@bp.route('/follow/<int:id>', methods=['GET'])
@token_auth.login_required
def follow(id):
    """关注一个用户"""
    user = User.query.get_or_404(id)
    if g.current_user == user:
        return bad_request('You cannot follow yourself')
    if g.current_user.is_following(user):
        return bad_request('You have already followed that user')
    g.current_user.follow(user)
    db.session.commit()
    return jsonify({
        'status': 'success',
        'message': 'You are now following %d.' % id
    })


@bp.route('/unfollow/<int:id>', methods=['GET'])
@token_auth.login_required
def unfollow(id):
    """取消关注一个用户"""
    user = User.query.get_or_404(id)
    if g.current_user == user:
        return bad_request('You cannot unfollow yourself.')
    if not g.current_user.is_following(user):
        return bad_request('You are not following this user.')
    g.current_user.unfollow(user)
    db.session.commit()
    return jsonify({
        'status': 'success',
        'message': 'You are not following %d anymore.' % id
    })


@bp.route('/users/<int:id>/followeds/', methods=['GET'])
@token_auth.login_required
def get_followeds(id):
    """返回关注者列表"""
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('pages', current_app.config['USERS_PER_PAGE'], type=int), 100)
    data = User.to_collection_dict(
        user.followeds, page, per_page, 'api.get_followeds', id=id)
    # 为每个 followed 添加 is_following 标志位
    for item in data['items']:
        item['is_following'] = g.current_user.is_following(User.query.get(item['id']))
        # 获取用户开始关注 followed 的时间
        # 获取用户开始关注 followed 的时间
        res = db.engine.execute(
            "select * from followers where follower_id={} and followed_id={}".
                format(user.id, item['id']))
        item['timestamp'] = datetime.strptime(
            list(res)[0][2], '%Y-%m-%d %H:%M:%S.%f')
    return jsonify(data)


@bp.route('/users/<int:id>/followers/', methods=['GET'])
@token_auth.login_required
def get_followers(id):
    """返回粉丝列表"""
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(
        request.args.get(
            'per_page', current_app.config['USERS_PER_PAGE'], type=int), 100)
    data = User.to_collection_dict(
        user.followers, page, per_page, 'api.get_followers', id=id)
    # 为每个 follower 添加 is_following 标志位
    for item in data['items']:
        item['is_following'] = g.current_user.is_following(
            User.query.get(item['id']))
        # 获取 follower 开始关注该用户的时间
        res = db.engine.execute(
            "select * from followers where follower_id={} and followed_id={}".
                format(item['id'], user.id))
        item['timestamp'] = datetime.strptime(
            list(res)[0][2], '%Y-%m-%d %H:%M:%S.%f')
    return jsonify(data)


@bp.route('/users/<int:id>/followeds-posts/', methods=['GET'])
@token_auth.login_required
def get_user_followed_posts(id):
    """获取关注者的文章"""
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(
        request.args.get(
            'per_page', current_app.config['POSTS_PER_PAGE'], type=int), 100)
    data = Post.to_collection_dict(user.followed_posts, page, per_page, 'api.get_user_followed_posts', id=id)
    return jsonify(data)


@bp.route('/users/<int:id>/posts/', methods=['GET'])
@token_auth.login_required
def get_user_posts(id):
    """返回用户的所有文章列表"""
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(
        request.args.get(
            'per_page', current_app.config['POSTS_PER_PAGE'], type=int), 100)
    data = Post.to_collection_dict(
        user.posts.order_by(Post.timestamp.desc()), page, per_page,
        'api.get_user_posts', id=id)
    return jsonify(data)

@bp.route('/users/permissions/', methods=['GET'])
@token_auth.login_required
def get_user_Permissions():
    """获取权限"""
    currentUser = g.current_user
    moduleName = request.args.get('moduleName')
    if (currentUser.id == 1 and moduleName == "Demo"):
        return jsonify(["edit","add","delete","query"])
    else:
        return jsonify(["add","delete"])
