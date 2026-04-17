from flask import Flask, render_template
from visitors.models_flask import db, Post
from visitors.routes_flask import posts_bp
import os

app = Flask(__name__, template_folder='visitors/templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vms_new.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Register Blueprints
app.register_blueprint(posts_bp, url_prefix='/api')

@app.route('/')
@app.route('/past-visitors')
@app.route('/guest-feed')
def guest_feed():
    return render_template('visitors/past_visiter.html')

def seed_data():
    if Post.query.count() == 0:
        posts = [
            Post(
                name="Shri. Nitin Gadkari",
                type="VIP",
                time="17 Apr 2026, 11:00 AM",
                description="Inaugurated the new 'Kalyan Jadhav Smruti Bhavan'. Appreciated the efforts of Vidhyarthi Sahayak Samiti for student welfare.",
                media_url="/static/img/v1.png", # Using existing img as placeholder
                media_type="image",
                status="Visited",
                profile_image="/static/img/p1.png"
            ),
            Post(
                name="Smt. Rohini Patil",
                type="Donor",
                time="16 Apr 2026, 02:30 PM",
                description="Contributed a generous donation for the digital library project. She interacted with the students and shared her life journey.",
                media_url="/static/img/v2.png",
                media_type="image",
                status="Visited",
                profile_image="/static/img/p2.png"
            ),
            Post(
                name="Mr. Rahul Khanna",
                type="Visitor",
                time="15 Apr 2026, 04:00 PM",
                description="Visited for a technical recruitment drive. 15 students were shortlisted for the final interview round.",
                media_url="",
                media_type="text",
                status="Visited",
                profile_image="/static/img/p1.png"
            )
        ]
        db.session.bulk_save_objects(posts)
        db.session.commit()
        print("Guest Activity Feed data seeded.")

if __name__ == '__main__':
    with app.app_context():
        # Clean current DB to match new model
        db.drop_all()
        db.create_all()
        seed_data()
    app.run(debug=True, port=5000)
