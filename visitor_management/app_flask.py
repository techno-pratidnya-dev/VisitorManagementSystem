from flask import Flask, render_template
from visitors.models_flask import db, Visitor
from visitors.routes_flask import visitors_bp
import os

app = Flask(__name__, template_folder='visitors/templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vms_new.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Register Blueprints
app.register_blueprint(visitors_bp, url_prefix='/api')

@app.route('/')
@app.route('/past-visitors')
def past_visitors():
    return render_template('visitors/past_visiter.html')

def seed_data():
    if Visitor.query.count() == 0:
        visitors = [
            Visitor(
                name="Rahul Sharma",
                time="12 Apr 2026, 10:30 AM",
                purpose="Project discussion meeting",
                meeting_with="HR Manager",
                status="Visited",
                profile_image="/static/img/p1.png",
                visitor_image="/static/img/v1.png"
            ),
            Visitor(
                name="Sneha Patil",
                time="12 Apr 2026, 11:45 AM",
                purpose="Interview for Senior Dev role",
                meeting_with="Tech Lead",
                status="Pending",
                profile_image="/static/img/p2.png",
                visitor_image="/static/img/v2.png"
            ),
            Visitor(
                name="Amit Verma",
                time="11 Apr 2026, 02:15 PM",
                purpose="Client visit for vendor audit",
                meeting_with="Operations Head",
                status="Cancelled",
                profile_image="/static/img/p1.png",
                visitor_image="/static/img/v1.png"
            ),
            Visitor(
                name="Priya Singh",
                time="11 Apr 2026, 04:00 PM",
                purpose="General inquiry and registration",
                meeting_with="Receptionist",
                status="Visited",
                profile_image="/static/img/p2.png",
                visitor_image="/static/img/v2.png"
            )
        ]
        db.session.bulk_save_objects(visitors)
        db.session.commit()
        print("Initial data seeded.")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_data()
    app.run(debug=True, port=5000)
