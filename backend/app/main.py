from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database setup
DATABASE_URL = "postgresql://postgres:Tharun@localhost:5432/AIMonk"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# CORS setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database model
class Tree(Base):
    __tablename__ = "tableaimonk"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    data = Column(JSON, nullable=False)

Base.metadata.create_all(bind=engine)

# Pydantic model
class TreeModel(BaseModel):
    name: str
    data: dict

    class Config:
        orm_mode = True

# Routes
@app.get("/tree/", response_model=list[TreeModel])
def get_trees():
    db = SessionLocal()
    try:
        trees = db.query(Tree).all()
        return trees
    finally:
        db.close()

@app.post("/tree/", response_model=TreeModel)
def create_tree(tree: TreeModel):
    db = SessionLocal()
    try:
        db_tree = Tree(name=tree.name, data=tree.data)
        db.add(db_tree)
        db.commit()
        db.refresh(db_tree)
        return db_tree
    finally:
        db.close()

@app.put("/tree/update", response_model=TreeModel)
async def update_tree(tree: TreeModel, request: Request):
    request_body = await request.json()
    # print("Request Body:", request_body)

    db = SessionLocal()
    try:
        db_tree = db.query(Tree).filter(Tree.name == tree.name).first()
        if not db_tree:
            raise HTTPException(status_code=404, detail="Tree not found")
        db_tree.data = tree.data
        db.commit()
        db.refresh(db_tree)
        return db_tree
    finally:
        db.close()
