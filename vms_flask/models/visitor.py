from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    time = db.Column(db.String(50), nullable=False) # Store formatted string or datetime
    purpose = db.Column(db.String(200), nullable=False)
    meeting_with = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Pending') # Visited, Pending, Cancelled
    profile_image = db.Column(db.String(200))
    visitor_image = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "time": self.time,
            "purpose": self.purpose,
            "meeting_with": self.meeting_with,
            "status": self.status,
            "profile_image": self.profile_image,
            "visitor_image": self.visitor_image
        }
