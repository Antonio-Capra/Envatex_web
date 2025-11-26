"""Modelo de Usuario para autenticación."""
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String


class User(db.Model):
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))

    def set_password(self, password: str) -> None:
        """Hashea y guarda la contraseña."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verifica si la contraseña coincide con el hash."""
        return check_password_hash(self.password_hash, password)

    def serialize(self) -> dict:
        """Convierte el objeto User en un diccionario serializable."""
        return {'id': self.id, 'username': self.username}
