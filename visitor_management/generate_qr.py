import qrcode
import os

# URL of the visitor entry form
url = "https://visitormanagementsystem-5eda.onrender.com/visitor-entry/"
output_dir = os.path.join(os.path.dirname(__file__), "visitors", "static", "visitors", "images")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "visitor_entry_qr.png")

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save(output_path)

print(f"✅ QR code generated successfully!")
print(f"📁 Saved to: {output_path}")
print(f"🔗 URL: {url}")
