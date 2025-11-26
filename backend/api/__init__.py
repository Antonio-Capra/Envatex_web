"""Registro centralizado de blueprints de la API."""
from .auth import auth_bp
from .products import products_bp
from .quotations import quotations_bp


def register_blueprints(app):
    """Registra todos los blueprints en la aplicación Flask."""
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(quotations_bp)
