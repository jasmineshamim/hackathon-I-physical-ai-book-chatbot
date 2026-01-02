from sqlalchemy import Column, String, Text, DateTime, UUID, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func
from ..config.database import Base
import uuid


class Question(Base):
    __tablename__ = "questions"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    session_id = Column(PG_UUID(as_uuid=True), ForeignKey("chat_sessions.id"), nullable=False)
    selected_text = Column(Text)  # Optional, for focused queries
    created_at = Column(DateTime, default=func.now(), nullable=False)

    def __repr__(self):
        return f"<Question(id={self.id}, session_id={self.session_id})>"