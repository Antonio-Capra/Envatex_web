"""Script para sincronizar migraciones con base de datos existente."""
import sys
import os

# Add parent directory to path to import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app import create_app, db

def sync_migrations():
    """Marca las migraciones como aplicadas sin ejecutarlas."""
    app = create_app()
    
    with app.app_context():
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
                print("✅ Tablas detectadas. Creando tabla alembic_version...")
                db.session.execute(text(
                    "CREATE TABLE alembic_version (version_num VARCHAR(32) NOT NULL, CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num))"
                ))
                db.session.commit()
                
                # Marcar la migración inicial como aplicada
                print("✅ Marcando migración inicial como aplicada...")
                db.session.execute(text(
                    "INSERT INTO alembic_version (version_num) VALUES ('fbde8b5cf973')"
                ))
                db.session.commit()
                print("✅ Base de datos sincronizada con migraciones")
            elif alembic_exists:
                # Verificar si ya hay versiones registradas
                result = db.session.execute(text("SELECT version_num FROM alembic_version"))
                versions = [row[0] for row in result]
                
                if not versions and products_exists:
                    # Hay tabla de versiones pero está vacía y las tablas existen
                    print("✅ Marcando migración inicial como aplicada...")
                    db.session.execute(text(
                        "INSERT INTO alembic_version (version_num) VALUES ('fbde8b5cf973')"
                    ))
                    db.session.commit()
                    print("✅ Base de datos sincronizada con migraciones")
                elif versions:
                    print(f"ℹ️ Migraciones ya sincronizadas: {versions}")
                else:
                    print("ℹ️ Base de datos limpia, las migraciones se aplicarán normalmente")
            else:
                print("ℹ️ Base de datos limpia, las migraciones se aplicarán normalmente")
                
        except Exception as e:
            print(f"❌ Error al sincronizar migraciones: {e}")
            db.session.rollback()
            sys.exit(1)

if __name__ == '__main__':
    sync_migrations()
