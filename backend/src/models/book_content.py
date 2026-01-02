from sqlalchemy import Column, String, Integer, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from ..config.database import Base
import uuid


class BookContentChunk(Base):
    __tablename__ = "book_content_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    book_id = Column(String, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    page_number = Column(Integer)
    section_title = Column(String)
    # Note: embedding_vector will be stored in Qdrant, not PostgreSQL
    metadata = Column(JSON)  # Additional metadata like paragraph numbers, etc.
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<BookContentChunk(id={self.id}, book_id={self.book_id}, chunk_index={self.chunk_index})>"