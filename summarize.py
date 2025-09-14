from openai import OpenAI
import pdfplumber
from dotenv import load_dotenv
import os
from google.cloud import vision
from PIL import Image
import io

# Load environment variables from .env file
load_dotenv()

# Only set Google credentials if they exist in environment
google_creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if google_creds:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_creds

# Get API key from environment
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

import glob

# Get all files from InputFiles directory
file_paths = glob.glob("InputFiles/*")

all_text = ""
images = []

for path in file_paths:
    print(f"Processing file: {path}")
    if path.lower().endswith(".txt"):
        with open(path, "r", encoding="utf-8") as f:
            all_text += f"\n\n--- Content of {path} ---\n\n{f.read()}"
    elif path.lower().endswith(".pdf"):
        with pdfplumber.open(path) as pdf:
            for i, page in enumerate(pdf.pages, start=1):
                all_text += f"\n\n--- Content of {path}, page {i} ---\n\n"
                all_text += page.extract_text() + f"\n[Refer to images/{path}_page{i}.jpg]\n"
                for img_index, img in enumerate(page.images):
                    image_filename = f"images/{path}_page{i}_img{img_index}.jpg"
                    images.append(image_filename)
                    # Optional: Save images
    elif path.lower().endswith((".jpg", ".jpeg")):
        print(f"Found image file: {path}")
        if google_creds:
            try:
                print("Attempting OCR with Google Vision...")
                vision_client = vision.ImageAnnotatorClient()
                # Open the image and convert to bytes
                with Image.open(path) as img:
                    with io.BytesIO() as output:
                        img.save(output, format="JPEG")
                        content = output.getvalue()

                image = vision.Image(content=content)
                response = vision_client.document_text_detection(image=image)
                ocr_text = response.full_text_annotation.text
                print(f"OCR extracted {len(ocr_text)} characters")
                all_text += f"\n\n--- OCR Text from {path} ---\n\n"
                all_text += ocr_text
            except Exception as e:
                print(f"Warning: Could not process image {path}: {e}")
                all_text += f"\n\n--- Image file {path} (OCR not available) ---\n\n"
        else:
            print(f"Warning: Google Cloud Vision not configured, skipping image {path}")
            all_text += f"\n\n--- Image file {path} (OCR not available) ---\n\n"


prompt = f"""make a summarization of the files given in the form of an article-like text. Most of the information inside of the
files will be overlapping, so make sure to not use redundant information and try to highlight important or special information.
Make it readable and easy to understand for college level students. Also make a multiple answer question and short form answer 
question set with the correct answers and where you got the answer based on the text given, use this format as an example for 
the summarization and questions. Make sure to use "-----------" to separate texts between summarization, questions, and answers.

*Title of material*

*Subtitile 1*

Information about subtitle 1

*Subtitle 2*

-bullet point 1 of subtitle 2
-bullet point 2 of subtitle 2
-.....

-----------

*Question section*

1. Question 1
a.)option a
b.)option b
c.)option c
d.)option d
e.)option e

2. Question 2
short form answer here

...

-----------

*Answer sheet*
1. Answer 1 
2. Answer 2

....

{all_text}"""

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": prompt}
    ]
)

sections = response.choices[0].message.content.split("-----------")

# Save each section into separate files
if len(sections) >= 3:
    summarization = sections[0].strip()
    questions = sections[1].strip()
    answers = sections[2].strip()

    with open("OutputFiles/summarization.txt", "w", encoding="utf-8") as f:
        f.write(summarization)

    with open("OutputFiles/questions.txt", "w", encoding="utf-8") as f:
        f.write(questions)

    with open("OutputFiles/answers.txt", "w", encoding="utf-8") as f:
        f.write(answers)

    print("Files saved successfully!")
else:
    print("The output did not contain the expected separator lines.")
