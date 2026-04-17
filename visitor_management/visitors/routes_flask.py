from flask import Blueprint, jsonify, request, render_template
from .models_flask import Visitor, db

visitors_bp = Blueprint('visitors', __name__)

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
    data = request.json
    new_visitor = Visitor(
        name=data['name'],
        time=data.get('time', 'Just now'),
        purpose=data['purpose'],
        meeting_with=data['meeting_with'],
        status=data.get('status', 'Pending'),
        profile_image=data.get('profile_image', '/static/img/p1.png'),
        visitor_image=data.get('visitor_image', '/static/img/v1.png')
    )
    db.session.add(new_visitor)
    db.session.commit()
    return jsonify(new_visitor.to_dict()), 201

@visitors_bp.route('/visitors/<int:visitor_id>', methods=['PUT', 'PATCH'])
def update_visitor(visitor_id):
    visitor = Visitor.query.get_or_404(visitor_id)
    data = request.json
    
    if 'name' in data: visitor.name = data['name']
    if 'purpose' in data: visitor.purpose = data['purpose']
    if 'meeting_with' in data: visitor.meeting_with = data['meeting_with']
    if 'status' in data: visitor.status = data['status']
    
    db.session.commit()
    return jsonify(visitor.to_dict())
