from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from ..config.database import Base
import uuid


class UserSelection(Base):
    __tablename__ = "user_selections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    book_id = Column(String, nullable=False)
    start_position = Column(Integer)  # Character position in the book
    end_position = Column(Integer)    # Character position in the book
    page_range = Column(String)       # Page range if applicable
    created_at = Column(DateTime, default=func.now(), nullable=False)

    def __repr__(self):
        return f"<UserSelection(id={self.id}, book_id={self.book_id})>"