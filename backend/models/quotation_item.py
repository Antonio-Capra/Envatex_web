"""Modelo de Items de la Cotización."""
from app import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .quotation import Quotation
    from .product import Product


class QuotationItem(db.Model):
    __tablename__ = 'quotation_items'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer)
    quotation_id: Mapped[int] = mapped_column(ForeignKey('quotations.id'))
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'))

    # Relaciones bidireccionales
    quotation: Mapped["Quotation"] = relationship(back_populates='items')
    product: Mapped["Product"] = relationship()
    
    def serialize(self) -> dict:
        """Convierte el objeto QuotationItem en un diccionario serializable."""
        return {
            'id': self.id,
            'quantity': self.quantity,
            'quotation_id': self.quotation_id,
            'product_id': self.product_id,
            'product': self.product.serialize() if self.product else None,
        }
