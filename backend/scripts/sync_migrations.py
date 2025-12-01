"""Script para sincronizar migraciones con base de datos existente."""
import sys
from sqlalchemy import text
from app import create_app, db

def sync_migrations():
    """Marca las migraciones como aplicadas sin ejecutarlas."""
    app = create_app()
    
    with app.app_context():
        try:
            # Verificar si la tabla alembic_version existe
            result = db.session.execute(text(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'alembic_version')"
            ))
            alembic_exists = result.scalar()
            
            if not alembic_exists:
                # Crear tabla alembic_version
                print("✅ Creando tabla alembic_version...")
                db.session.execute(text(
                    "CREATE TABLE alembic_version (version_num VARCHAR(32) NOT NULL, CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num))"
                ))
                db.session.commit()
            
            # Verificar si ya hay versiones registradas
            result = db.session.execute(text("SELECT version_num FROM alembic_version"))
            versions = [row[0] for row in result]
            
            if not versions:
                # Marcar la migración inicial como aplicada
                print("✅ Marcando migración inicial como aplicada...")
                db.session.execute(text(
                    "INSERT INTO alembic_version (version_num) VALUES ('fbde8b5cf973')"
                ))
                db.session.commit()
                print("✅ Base de datos sincronizada con migraciones")
            else:
                print(f"ℹ️ Migraciones ya sincronizadas: {versions}")
                
        except Exception as e:
            print(f"❌ Error al sincronizar migraciones: {e}")
            db.session.rollback()
            sys.exit(1)

if __name__ == '__main__':
    sync_migrations()
