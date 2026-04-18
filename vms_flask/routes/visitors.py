from flask import Blueprint, jsonify, request
import os
import uuid
from werkzeug.utils import secure_filename
from models.visitor import Visitor, db

visitors_bp = Blueprint('visitors', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@visitors_bp.route('/visitors', methods=['GET'])
def get_visitors():
    status_filter = request.args.get('status')
    search_query = request.args.get('search')
    
    query = Visitor.query
    
    if status_filter and status_filter != 'All':
        query = query.filter_by(status=status_filter)
        
    if search_query:
        query = query.filter(Visitor.name.ilike(f'%{search_query}%'))
        
    visitors = query.order_by(Visitor.id.desc()).all()
    return jsonify([v.to_dict() for v in visitors])

@visitors_bp.route('/visitors', methods=['POST'])
def create_visitor():
    data = request.form if request.form else request.json
    
    visitor_image_path = '/static/img/v1.png'
    
    if 'vImage' in request.files:
        file = request.files['vImage']
        if file.filename != '':
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'jpg'
            filename = f"{uuid.uuid4().hex}.{ext}"
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            visitor_image_path = f"/static/uploads/{filename}"
    
    new_visitor = Visitor(
        name=data.get('name', 'Unknown'),
        time=data.get('time', 'Just now'),
        purpose=data.get('purpose', ''),
        meeting_with=data.get('meeting_with', ''),
        status=data.get('status', 'Pending'),
        profile_image=data.get('profile_image', '/static/img/p1.png'),
        visitor_image=visitor_image_path
    )
    db.session.add(new_visitor)
    db.session.commit()
    return jsonify(new_visitor.to_dict()), 201

@visitors_bp.route('/visitors/<int:visitor_id>', methods=['PUT', 'PATCH'])
def update_visitor(visitor_id):
    visitor = Visitor.query.get_or_404(visitor_id)
    data = request.form if request.form else request.json
    
    if data:
        if 'name' in data: visitor.name = data['name']
        if 'purpose' in data: visitor.purpose = data['purpose']
        if 'meeting_with' in data: visitor.meeting_with = data['meeting_with']
        if 'status' in data: visitor.status = data['status']
        
    if 'vImage' in request.files:
        file = request.files['vImage']
        if file.filename != '':
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'jpg'
            filename = f"{uuid.uuid4().hex}.{ext}"
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            visitor.visitor_image = f"/static/uploads/{filename}"
    
    db.session.commit()
    return jsonify(visitor.to_dict())

@visitors_bp.route('/visitors/<int:visitor_id>', methods=['DELETE'])
def delete_visitor(visitor_id):
    visitor = Visitor.query.get_or_404(visitor_id)
    db.session.delete(visitor)
    db.session.commit()
    return jsonify({'message': 'Visitor deleted successfully'}), 200
