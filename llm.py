from openai import OpenAI
from retrival import retrieve_from_chroma
from dotenv import load_dotenv
import os, re, logging
import csv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

api_key = os.getenv("OPENROUTER_API_KEY")
client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)

# ---------- Utility Functions ----------

# Clean up retrieved text
def clean_context(context_text: str) -> str:
    if not context_text:
        return ""
    lines = [line.strip() for line in context_text.splitlines() if line.strip()]
    return "\n".join(
        [line for line in lines if not re.fullmatch(r"vector_\d+", line) and len(line) > 5]
    )

# Build context from retriever results
def _build_context_from_results(results: dict) -> str:
    docs = results.get("documents", [])
    if docs and isinstance(docs[0], list):
        return "\n\n".join(docs[0])
    metas = results.get("metadatas", [])
    if metas and isinstance(metas[0], list):
        return "\n\n".join(
            " ".join(str(v) for v in m.values()) if isinstance(m, dict) else str(m)
            for m in metas[0]
        )
    return ""


# ---------- LLM Answer Function ----------
def is_greeting_or_casual(text: str) -> bool:
    text = text.lower()
    greeting_keywords = [
        "hello", "hi", "hey", "good morning", "good evening",
        "aslamwalekum", "salam", "salaam", "namaste",
        "kaise ho", "how are you", "what's up", "kya haal hai"
    ]
    return any(keyword in text for keyword in greeting_keywords)


def generate_answer(question: str, context: str = None, persist_dir: str = "chroma_db", top_k: int = 3) -> str:
    q_lower = question.strip().lower()
    # ✅ Detect greetings/casual chats
    if is_greeting_or_casual(q_lower):
        context_text = ""   # don’t do RAG at all
        use_rag = False
    else:
        use_rag = True
        if context is None:
            results = retrieve_from_chroma(question, persist_dir=persist_dir, top_k=top_k)
            context_text = _build_context_from_results(results)
        else:
            context_text = context
        context_text = clean_context(context_text)

    # ✅ If no RAG and not a casual → return fallback
    if use_rag and not context_text.strip():
        return "Sorry, that's not in our knowledge base."

    # System rules
    system_prompt = """
You are a strict Retrieval-Augmented Generation (RAG) assistant.
You are a smart and helpful AI chatbot created by Uzair and Nigar.
You understand and respond in any language the user uses, including but not limited to Hindi, English, Spanish, French, Arabic, etc.
Always reply in the same language the user uses in their question.
If the user asks who created you, who is your owner, or any variation of that question, respond with exactly one sentence:

In English: "Nigar is my creator."

In Hindi: "मुझे निगार ने बनाया है।"

In any other language: Respond in the same language with the equivalent of “Nigar is my creator.”
Do not elaborate, do not repeat, and do not rephrase this sentence.
Be direct, concise, and consistent.
Rules:
1. Greetings:
   - "hello", "hi", "hey", "good morning" → reply in English only.
   - "namaste" → reply in Hindi only.
   - "aslamwalekum" → reply in Urdu/Hindi style only ("Wa Alaikum Assalam").
   - Do NOT mix greetings across languages.

2. Language:
   - If the user writes fully in Hindi → reply fully in Hindi only.
   - If the user writes fully in English → reply fully in English only.
   - If the user writes in Hinglish → reply in Hinglish, matching their style.
   - If the user provides or asks for customer, employee, or tabular data (e.g., name, salary, phone number, etc.), respond in **valid JSON array format**, with one object per row if multiple entries exist.change line after ','

For single object responses, present the key-value pairs like this:
"FIRST_NAME": "Jennifer",  
"LAST_NAME": "Whalen",  
"EMAIL": "JWHALEN",  
"PHONE_NUMBER": "515.123.4444",  
"HIRE_DATE": "17-SEP-03",  
"JOB_ID": "AD_ASST",  
"SALARY": "4400",  
"COMMISSION_PCT": null,  
"MANAGER_ID": "101",  
"DEPARTMENT_ID": "10"

Rules:
- **Do not wrap the object in `{}` for single entries**.
- For a **single record**, output each key-value pair on a **new line**, followed by a comma.
- If multiple records are present, wrap the entries in a JSON array `[...]`, where each object is wrapped in `{}` and follows the same formatting style.
- Convert any dashes (`"-"`) to `null` values.
- Use valid JSON syntax.
- Do not include natural language explanation or commentary unless explicitly asked.

   - Never add translations, parentheses, or explanations in another language.
3. Nigar is the creator of this chatbot. Any question regarding the chatbot's origin, ownership, or developer should be answered by acknowledging Nigar as the creator.
4. Casual questions (like "kaise ho", "what's up", jokes):
   - Answer in a friendly, funny way in the SAME language(s) as the user.

5. Knowledge-based questions:
   - Use ONLY the provided context.
   - If the answer is not in the context, strictly reply: "I don't know."

6. Never mix languages unless the user mixes them.

"""
    # ✅ Build prompt
    prompt = f"""
Context:
{context_text if use_rag else "(no context, casual chat)"}

Question: {question}

Answer:
"""

    try:
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.exception("LLM response parsing failed: %s", e)
        return "An error occurred while getting an answer from the LLM."
