#!/usr/bin/env python
"""
Script para inicializar la base de datos en producción.
Se ejecuta automáticamente antes de iniciar el servidor.
"""
import os
import sys

# Agregar el directorio backend al path
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app, db
from models import User, Product, Quotation, QuotationItem
from sqlalchemy import text

def add_customer_comments_column():
    """Agrega la columna customer_comments si no existe."""
    try:
        # Verificar si la columna ya existe
        result = db.session.execute(text(
            "SELECT column_name FROM information_schema.columns WHERE table_name='quotations' AND column_name='customer_comments'"
        ))
        column_exists = result.scalar()
        
        if not column_exists:
            print("🔄 Adding customer_comments column...")
            db.session.execute(text(
                "ALTER TABLE quotations ADD COLUMN customer_comments TEXT"
            ))
            db.session.commit()
            print("✅ customer_comments column added")
        else:
            print("ℹ️ customer_comments column already exists")
    except Exception as e:
        print(f"⚠️ Warning during column addition: {e}")
        db.session.rollback()

def sync_alembic_version():
    """Sincroniza la tabla alembic_version con el estado actual de la base de datos."""
    try:
        # Verificar si las tablas existen
        result = db.session.execute(text(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products')"
        ))
        products_exists = result.scalar()
        
        # Verificar si la tabla alembic_version existe
        result = db.session.execute(text(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'alembic_version')"
        ))
        alembic_exists = result.scalar()
        
        if products_exists and not alembic_exists:
            # Las tablas existen pero no hay registro de migraciones
            print("🔄 Syncing alembic_version table...")
            db.session.execute(text(
                "CREATE TABLE alembic_version (version_num VARCHAR(32) NOT NULL, CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num))"
            ))
            db.session.execute(text(
                "INSERT INTO alembic_version (version_num) VALUES ('fbde8b5cf973')"
            ))
            # Marcar también la segunda migración como aplicada si customer_comments ya existe
            result = db.session.execute(text(
                "SELECT column_name FROM information_schema.columns WHERE table_name='quotations' AND column_name='customer_comments'"
            ))
            if result.scalar():
                db.session.execute(text(
                    "INSERT INTO alembic_version (version_num) VALUES ('c5b4823dc4e3')"
                ))
            db.session.commit()
            print("✅ Alembic version table synced")
        elif alembic_exists:
            result = db.session.execute(text("SELECT version_num FROM alembic_version"))
            versions = [row[0] for row in result]
            if not versions and products_exists:
                print("🔄 Marking initial migration as applied...")
                db.session.execute(text(
                    "INSERT INTO alembic_version (version_num) VALUES ('fbde8b5cf973')"
                ))
                # Marcar también la segunda migración si customer_comments ya existe
                result = db.session.execute(text(
                    "SELECT column_name FROM information_schema.columns WHERE table_name='quotations' AND column_name='customer_comments'"
                ))
                if result.scalar():
                    db.session.execute(text(
                        "INSERT INTO alembic_version (version_num) VALUES ('c5b4823dc4e3')"
                    ))
                db.session.commit()
                print("✅ Initial migration marked as applied")
    except Exception as e:
        print(f"⚠️ Warning during alembic sync: {e}")
        db.session.rollback()

def init_database():
    """Inicializa la base de datos y crea el usuario admin."""
    app = create_app()
    
    with app.app_context():
        try:
            # Sincronizar alembic_version antes de crear tablas
            sync_alembic_version()
            
            # Crear todas las tablas
            print("🔄 Creating/verifying database tables...")
            db.create_all()
            print("✅ Database tables created/verified")
            
            # Agregar columna customer_comments si no existe
            add_customer_comments_column()
            
            # Crear usuario admin
            admin_user = os.getenv('ADMIN_USER', 'admin')
            admin_pass = os.getenv('ADMIN_PASSWORD', 'admin123')
            
            existing = User.query.filter_by(username=admin_user).first()
            if not existing:
                u = User(username=admin_user)
                u.set_password(admin_pass)
                db.session.add(u)
                db.session.commit()
                print(f"✅ Admin user '{admin_user}' created successfully")
            else:
                print(f"ℹ️  Admin user '{admin_user}' already exists")
                
            print("✅ Database initialization complete!")
            return True
            
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    success = init_database()
    sys.exit(0 if success else 1)
