from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), default='Visitor') # VIP, Donor, Visitor
    time = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(255))
    media_type = db.Column(db.String(20)) # image, video, text
    status = db.Column(db.String(20), default='Visited')
    profile_image = db.Column(db.String(255), default='/static/img/p1.png')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'time': self.time,
            'description': self.description,
            'media_url': self.media_url,
            'media_type': self.media_type,
            'status': self.status,
            'profile_image': self.profile_image
        }
