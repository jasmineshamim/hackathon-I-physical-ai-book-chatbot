from sqlalchemy import Column, String, Text, DateTime, UUID, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func
from ..config.database import Base
import uuid


class Response(Base):
    __tablename__ = "responses"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    question_id = Column(PG_UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False)
    # Note: retrieved_chunks will be stored as references to Qdrant IDs
    confidence_score = Column(Float)  # Between 0.0 and 1.0
    created_at = Column(DateTime, default=func.now(), nullable=False)

    def __repr__(self):
        return f"<Response(id={self.id}, question_id={self.question_id})>"