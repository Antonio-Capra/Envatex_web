"""Modelo de Producto."""
from app import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text
from typing import Optional


class Product(db.Model):
    __tablename__ = 'products'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sku: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    def serialize(self) -> dict:
        """Convierte el objeto Product en un diccionario serializable."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'sku': self.sku,
            'image_url': self.image_url
        }
