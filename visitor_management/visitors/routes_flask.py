from flask import Blueprint, jsonify, request, render_template
from .models_flask import Post, db
import os

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    type_filter = request.args.get('type')
    search_query = request.args.get('search')
    
    query = Post.query
    
    if type_filter and type_filter != 'All':
        query = query.filter_by(type=type_filter)
        
    if search_query:
        query = query.filter(Post.name.ilike(f'%{search_query}%') | Post.description.ilike(f'%{search_query}%'))
        
    posts = query.order_by(Post.id.desc()).all()
    return jsonify([p.to_dict() for p in posts])

@posts_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.json
    new_post = Post(
        name=data['name'],
        type=data.get('type', 'Visitor'),
        time=data.get('time', 'Just now'),
        description=data.get('description', ''),
        media_url=data.get('media_url', ''),
        media_type=data.get('media_type', 'image'),
        status=data.get('status', 'Visited'),
        profile_image=data.get('profile_image', '/static/img/p1.png')
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.to_dict()), 201

@posts_bp.route('/posts/<int:post_id>', methods=['PUT', 'PATCH'])
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.json
    
    if 'name' in data: post.name = data['name']
    if 'type' in data: post.type = data['type']
    if 'description' in data: post.description = data['description']
    if 'media_url' in data: post.media_url = data['media_url']
    if 'media_type' in data: post.media_type = data['media_type']
    if 'status' in data: post.status = data['status']
    
    db.session.commit()
    return jsonify(post.to_dict())

@posts_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted successfully'}), 200
