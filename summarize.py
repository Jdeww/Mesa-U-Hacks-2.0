from openai import OpenAI

client = OpenAI(api_key="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")

file_paths = [
    r"C:\Users\jdwil\Downloads\test.txt"
]

# Read all files and combine text
all_text = ""
for path in file_paths:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        all_text += f"\n\n--- Content of {path} ---\n\n{content}"

prompt = f"""make a summarization of the files given in the form of an article-like text. Most of the information inside of the
    files will be overlaping, so make sure to not use redundant information and try to highlight important or special information.
    Make it readable and easy to understand for college level students. Also make a multiple answer question and short form answer 
    question set with the correct answers and where you got the answer based on the text given, use this format as an example for 
    the summarization and questions. Make sure to use "-----------" to seperate texts between summarization, questions, and answers.

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
    input= prompt
)

sections = response.output_text.split("-----------")

# Save each section into separate files
# Assuming the order: summarization, questions, answers
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
