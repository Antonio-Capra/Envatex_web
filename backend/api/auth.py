"""Rutas de autenticación."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login simple que emite un JWT con el role del usuario.

    Espera JSON: {"username": "...", "password": "..."}
    Devuelve: {"access_token": "...", "role": "admin"}
    """
    from models import User
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Se requieren nombre de usuario y contraseña'}), 400

    # Validar contra la tabla User
    try:
        user = User.query.filter_by(username=username).first()
    except Exception as e:
        return jsonify({'error': 'Error del servidor al acceder a los usuarios', 'details': str(e)}), 500

    if not user or not user.check_password(password):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    additional_claims = {'role': 'admin'}
    access_token = create_access_token(identity=username, additional_claims=additional_claims)
    return jsonify({'access_token': access_token, 'role': 'admin'}), 200
