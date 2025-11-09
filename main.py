import os,shutil
from typing import List
from fastapi import FastAPI,UploadFile,File,BackgroundTasks, Form,Body
from fastapi.middleware.cors import CORSMiddleware
from loader import load_all_files
from chunks import chunk_documents
from embeder import embed_chunks
from store import save_vectors_to_chroma
from retrival import retrieve_from_chroma
from llm import generate_answer 
from fastapi.responses import RedirectResponse
from database import db
from langchain_core.documents import Document
from fastapi import FastAPI, HTTPException, Depends, Request,Path,status
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from bson import ObjectId
from fastapi.security import OAuth2PasswordBearer
from auth import get_current_user  # assumes JWT returns user_id
from models.users import add_chat_to_user,create_or_get_google_user
from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
from models import users as users_model
from models.users import (
    create_session, add_message_to_session, get_sessions_for_user,
    get_session_chats, close_session, session_belongs_to_user,
    create_sessions_indexes
)
from pathlib import Path
router = APIRouter()
from pydantic import BaseModel
from typing import Optional

UPLOAD_DIR = "docs"   # where your pdfs live
PERSIST_DIR = "chroma_db"
SECRET_KEY = "your-super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
app = FastAPI(title="RAG PDF QA")
oauth2_schema = OAuth2PasswordBearer(tokenUrl="login")
GOOGLE_CLIENT_ID = os.getenv("17593623328-bdgflm4fo1ln4brovm9bibgpmaf03mpq.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.getenv("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")

config = Config(".env")
oauth = OAuth(config)

oauth.register(
    name="google",
    client_id=config("GOOGLE_CLIENT_ID"),
    client_secret=config("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# Required for OAuth session
app.add_middleware(SessionMiddleware, secret_key="your_secret_key")

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017")
db = client["chatbot_db"]
users_collection = db["users"]
# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# UTILS (reusable functions)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# get current user 
def get_current_user(token: str = Depends(oauth2_schema)):
    """Decode JWT and return current user details"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        username: str = payload.get("username")
        email: str = payload.get("email")

        if not user_id or not username:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")

        return {"user_id": user_id, "username": username, "email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# def process_file(file_path: str):
#     """
#     Load PDF, chunk it, embed, and save to Chroma.
#     """
#     docs = load_all_files(file_path)
#     chunks = chunk_documents(docs)
#     vectors, texts, metadatas = embed_chunks(chunks)
#     save_vectors_to_chroma(vectors, texts, metadatas, persist_dir=PERSIST_DIR)
#     print(f"Processed and saved vectors for {file_path}")

def process_file(file_path: str):
    """
    Process a single uploaded file:
    - Load and chunk the document
    - Generate embeddings
    - Add to existing Chroma DB
    """
    print(f"📂 Processing new file: {file_path}")

    try:
        # 1️⃣ Load file
        docs = load_all_files(file_path)
        if not docs:
            print(f"⚠️ No text extracted from {file_path}. Skipping.")
            return
        
        # 2️⃣ Chunk the document
        chunks = chunk_documents(docs)
        if not chunks:
            print(f"⚠️ No chunks created for {file_path}. Skipping.")
            return
        
        # 3️⃣ Generate embeddings
        vectors, texts, metadatas = embed_chunks(chunks)
        
        # 4️⃣ Load existing Chroma DB or create new one
        import chromadb
        client = chromadb.PersistentClient(path=PERSIST_DIR)
        try:
            collection = client.get_collection("my_vectors")
            print("🧠 Existing Chroma collection found. Adding new vectors...")
        except Exception:
            collection = client.create_collection("my_vectors")
            print("🆕 Created new Chroma collection.")

        # 5️⃣ Add new file's vectors
        collection.add(
            embeddings=vectors,
            documents=texts,
            metadatas=metadatas,
            ids=[f"{os.path.basename(file_path)}_{i}" for i in range(len(vectors))]
        )

        print(f"✅ File {file_path} successfully added to Chroma DB.")

    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")

def rebuild_vector_store():
    """Load all files in docs/, embed and save to Chroma DB."""
    try:
        print("Rebuilding vector store...")
        docs = load_all_files(UPLOAD_DIR)
        chunks = chunk_documents(docs)
        vectors, texts, metadatas = embed_chunks(chunks)
                # Clear old collection before saving
        import chromadb
        client = chromadb.PersistentClient(path=PERSIST_DIR)
        try:
            client.delete_collection("my_vectors")   # remove old vectors
        except Exception:
            pass  # collection might not exist yet

        save_vectors_to_chroma(vectors, texts, metadatas, persist_dir=PERSIST_DIR)
        print("Rebuild finished.")

    except Exception as e:
        print("Error rebuilding vector store:", e)

# Initialize vector store if not exists
if not os.path.exists(PERSIST_DIR) or not os.listdir(PERSIST_DIR):
    print("Vector store not found. Building…")
    rebuild_vector_store()
else:
    print("Vector store already exists. Skipping rebuild.")

# QueryRequest → frontend se question aata hai.
# AnswerResponse → backend ka final response (answer + supporting context).

# MODELS
class RegisterRequest(BaseModel):
    name: str
    username: str
    email: str
    password: str
    chats: List[str] = []

class LoginRequest(BaseModel):
    email: str
    password: str
class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class AnswerResponse(BaseModel):
    answer: str
    context: List[str]
    session_id: Optional[str] = None
class MessageIn(BaseModel):
    sender: str
    text: str
    meta: Optional[dict] = None
    

# ROUTERS

@app.get("/")
def health():
    return {"status": "ok"}

@app.get("/register")
def redirect_register():
    return RedirectResponse(url="http://localhost:3000/register")

@app.post("/api/register")
def register_user(data: RegisterRequest):
    if users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(data.password)
    new_user = {
        "name": data.name,
        "username": data.username,
        "email": data.email,
        "password": hashed_pw,
        "chats": []
    }

    result = users_collection.insert_one(new_user)
    user_id = str(result.inserted_id)

    return {"message": "User registered", "user_id": user_id}

@app.post("/api/login")
def login_user(data: LoginRequest):
    user = users_collection.find_one({
        "email": data.email
    })

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Generate JWT
    token_data = {
        "sub": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }

    access_token = create_access_token(token_data, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {
        "access_token": access_token,
        "user": {
            "user_id": str(user["_id"]),
            "username": user.get("username", ""),
            "email": user["email"],
        }
    }
@app.post("/api/sessions")
def api_create_session(name: Optional[str] = Body(None), current_user: dict = Depends(get_current_user)):
    session_id = create_session(current_user["user_id"], name)
    return {"session_id": session_id}

@app.get("/api/sessions")
def api_list_sessions(current_user: dict = Depends(get_current_user)):
    return {"sessions": get_sessions_for_user(current_user["user_id"])}

@app.get("/api/sessions/{session_id}")
def api_get_session(session_id: str, current_user: dict = Depends(get_current_user), limit: Optional[int] = None):
    if not session_belongs_to_user(session_id, current_user["user_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"chats": get_session_chats(session_id, limit)}

@app.post("/api/sessions/{session_id}/messages")
def api_add_message_to_session(session_id: str, message: MessageIn, current_user: dict = Depends(get_current_user)):
    if not session_belongs_to_user(session_id, current_user["user_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    ok = add_message_to_session(session_id, message.sender, message.text, message.meta)
    if not ok:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"ok": True}

@app.post("/upload/{username}")
async def upload_file(
    username: str,
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    current_user: dict = Depends(get_current_user),
):
    if username != current_user["username"]:
        raise HTTPException(
            status_code=403,
            details="you are not allowed to upload for this user"
        )
    """Upload file to docs/ and process it in the background."""
    safe_name = file.filename.replace("/", "_")
    user_dir = os.path.join(UPLOAD_DIR,username)
    os.makedirs(user_dir,exist_ok=True)
    target_path = os.path.join(user_dir, safe_name)

    try:
        # Save file to disk
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"Saved uploaded file to {target_path}")

        # Process in background if available
        if background_tasks:
            background_tasks.add_task(process_file, target_path)
            msg = "Upload successful. Processing file in background..."
        else:
            process_file(target_path)
            msg = "Upload successful. File processed."
    except Exception as e:
        return {"status": "error", "detail": str(e)}

    response = {
        "status": "success",
        "filename": safe_name,
        "message": msg,
        "uploaded_by":current_user["username"]
    }
    print("Upload response:", response)
    return response

@app.post("/ask/{username}", response_model=AnswerResponse)
def ask(
    username: str,
    req: QueryRequest,
    session_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Authenticated endpoint to ask a question for the logged-in user.
    URL: /ask/{username}
    """
    # check if username in path matches the logged-in users
    if username != current_user["username"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail = "Not authorized to ask questions for this user"
        )
    if not req or not req.question or not req.question.strip():
        return AnswerResponse(
            answer="Please enter a valid question before submitting.",
            context=[]
        )
    result = retrieve_from_chroma(req.question, persist_dir=PERSIST_DIR, top_k=req.top_k)
    context_list = result.get("documents", [[]])[0] if result.get("documents") else []

    if not context_list or all(c.strip() == "" for c in context_list):
        return AnswerResponse(
            answer="Invalid question, please ask a question from your documents.",
            context=[]
        )
    answer = generate_answer(req.question, context="\n\n".join(context_list))
    # print(answer)

    # Session handling:
    # - if session_id provided: validate ownership and append both user + assistant messages
    # - else: create a new session and return its id
    try:
        if session_id:
            if not session_belongs_to_user(session_id, current_user["user_id"]):
                raise HTTPException(status_code=403, detail="Session does not belong to the user")
        else:
            session_id = create_session(current_user["user_id"], name="Chat")
        # append user message then assistant message
        add_message_to_session(session_id, "user", req.question, meta={"source": "chroma"})
        add_message_to_session(session_id, "assistant", answer, meta={"source": "chroma"})
        try:
            add_chat_to_user(
                user_id=current_user["user_id"],
                question=req.question,
                answer=answer,
                meta={"source": "chroma"},
                keep_last_n=200
            )
        except Exception:
            pass
    except HTTPException:
        raise
    except Exception as e:
        print("Warning: could not save chat:", e)    
    return AnswerResponse(answer=answer, context=context_list,session_id=session_id)

@app.get("/api/chats/{username}")
def get_chats(username: str, current_user: dict = Depends(get_current_user)):
    if username != current_user["username"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view chats"
        )

    user = users_collection.find_one({"_id": ObjectId(current_user["user_id"])}, {"chats": 1})
    return {"chats": user.get("chats", []) if user else []}

@app.get("/debug_collection")
def debug_collection():
    import chromadb
    client = chromadb.PersistentClient(path=PERSIST_DIR)
    collection = client.get_collection("my_vectors")
    return {
        "count": collection.count(),
        "ids": collection.get()["ids"][:5],
        "documents": collection.get()["documents"][:5],
        "metadatas": collection.get()["metadatas"][:5]
    }
@app.get("/login/google")
async def login_google(request: Request):
    redirect_uri = "http://localhost:8000/api/auth/callback/google"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/api/auth/callback/google")
async def auth_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    if not user_info:
        raise HTTPException(status_code=400, detail="Failed to retrieve user info")

    # ✅ Save user in DB if not exists
    user = create_or_get_google_user(
        name=user_info.get("name", ""),
        email=user_info["email"],
        username=user_info["email"].split("@")[0],
        picture=user_info.get("picture")
    )
    # ✅ Create JWT
    token_data = {
        "sub": str(user["_id"]),
        "username": user.get("username"),
        "email": user.get("email")
    }

    access_token = create_access_token(token_data, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    # ✅ Redirect back to frontend with token & user info
    frontend_url = f"http://localhost:3000/auth/success?token={access_token}&user={user['username']}"
    return RedirectResponse(url=frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

