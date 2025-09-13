from openai import OpenAI
import pdfplumber
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

file_paths = [
    r"C:\Users\jdwil\Downloads\test.txt",
    # Add PDFs here if needed
]

all_text = ""
images = []

for path in file_paths:
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

response = client.responses.create(
    model="gpt-4.1-mini-2025-04-14",
    store=False,
    input=prompt
)

sections = response.output_text.split("-----------")

# Save each section into separate files
if len(sections) >= 3:
    summarization = sections[0].strip()
    questions = sections[1].strip()
    answers = sections[2].strip()

    with open("summarization.txt", "w", encoding="utf-8") as f:
        f.write(summarization)

    with open("questions.txt", "w", encoding="utf-8") as f:
        f.write(questions)

    with open("answers.txt", "w", encoding="utf-8") as f:
        f.write(answers)

    print("Files saved successfully!")
else:
    print("The output did not contain the expected separator lines.")
