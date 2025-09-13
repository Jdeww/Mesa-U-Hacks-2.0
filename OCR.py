from google.cloud import vision
from pdf2image import convert_from_path
import os
import io

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\jdwil\Downloads\bustling-syntax-472017-a4-9350377c4a41.json"

def handwriting(path):
    client = vision.ImageAnnotatorClient()
    pages = convert_from_path(path, poppler_path=r"C:\Users\jdwil\Downloads\Release-25.07.0-0\poppler-25.07.0\Library\bin")
    
    for i, page in enumerate(pages):
        # Convert PIL image to bytes
        with io.BytesIO() as output:
            page.save(output, format="JPEG")
            content = output.getvalue()
        
        image = vision.Image(content=content)
        response = client.document_text_detection(image=image)
        print(f"--- Page {i+1} ---")
        print(response.full_text_annotation.text)

# Example usage
handwriting(r"C:\Users\jdwil\Downloads\Untitled Notebook (14).pdf")