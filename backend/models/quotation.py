"""Modelo de Cotización."""
from app import db
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, DateTime
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .quotation_item import QuotationItem


class Quotation(db.Model):
    __tablename__ = 'quotations'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_name: Mapped[str] = mapped_column(String(100))
    customer_email: Mapped[str] = mapped_column(String(100))
    customer_phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    customer_comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default='Pending')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    admin_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relación con los items de la cotización
    items: Mapped[List["QuotationItem"]] = relationship(
        back_populates='quotation',
        cascade="all, delete-orphan"
    )
    
    def serialize(self) -> dict:
        """Convierte el objeto Quotation en un diccionario serializable."""
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'customer_comments': self.customer_comments,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'admin_response': self.admin_response,
            'items': [item.serialize() for item in self.items],
        }
