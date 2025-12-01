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

def init_database():
    """Inicializa la base de datos y crea el usuario admin."""
    app = create_app()
    
    with app.app_context():
        try:
            # Crear todas las tablas
            print("🔄 Creating database tables...")
            db.create_all()
            print("✅ Database tables created successfully")
            
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
