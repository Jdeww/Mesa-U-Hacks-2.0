from google.cloud import vision
from PIL import Image
import os
import io

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\jdwil\Downloads\bustling-syntax-472017-a4-9350377c4a41.json"

def handwriting(image_path):
    # Only process .jpg or .jpeg files
    if not image_path.lower().endswith(('.jpg', '.jpeg')):
        print("Skipping non-JPG image:", image_path)
        return

    client = vision.ImageAnnotatorClient()

    # Open the image and convert to bytes
    with Image.open(image_path) as img:
        with io.BytesIO() as output:
            img.save(output, format="JPEG")
            content = output.getvalue()

    image = vision.Image(content=content)
    response = client.document_text_detection(image=image)

    print(f"--- Text from {os.path.basename(image_path)} ---")
    print(response.full_text_annotation.text)

# Example usage
handwriting(r"C:\Users\jdwil\Downloads\'.jpg")