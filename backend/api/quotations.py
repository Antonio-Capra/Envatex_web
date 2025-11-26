"""Rutas de cotizaciones."""
from flask import Blueprint, request, jsonify
from app import db
from flask_jwt_extended import jwt_required, get_jwt

quotations_bp = Blueprint('quotations', __name__, url_prefix='/api/quotations')


@quotations_bp.route('', methods=['GET'])
@jwt_required()
def list_quotations():
    """Lista todas las cotizaciones (protegida, requiere JWT con role=admin)."""
    from models import Quotation
    try:
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Prohibido - se requiere rol de administrador'}), 403

        quotations = Quotation.query.order_by(Quotation.created_at.desc()).all()
        return jsonify([q.serialize() for q in quotations]), 200
    except Exception as e:
        return jsonify({'error': 'No se pudieron obtener las cotizaciones', 'details': str(e)}), 500


@quotations_bp.route('', methods=['POST'])
def create_quotation():
    """Crea una nueva cotización."""
    from models import Quotation, QuotationItem, Product
    data = request.get_json()

    if not data or 'customer_name' not in data or 'customer_email' not in data:
        return jsonify({'error': 'Se requieren nombre y correo del cliente (customer_name y customer_email)'}), 400

    try:
        new_quotation = Quotation(
            customer_name=data['customer_name'],
            customer_email=data['customer_email'],
            customer_phone=data.get('customer_phone')
        )
        db.session.add(new_quotation)

        if 'items' in data and isinstance(data['items'], list):
            for item_data in data['items']:
                product = Product.query.get(item_data['product_id'])
                if not product:
                    db.session.rollback()
                    return jsonify({'error': f"Producto con id {item_data['product_id']} no encontrado"}), 404

                quotation_item = QuotationItem(
                    quotation=new_quotation,
                    product=product,
                    quantity=item_data['quantity']
                )
                db.session.add(quotation_item)

        db.session.commit()
        return jsonify({'message': 'Cotización creada correctamente'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Ocurrió un error', 'details': str(e)}), 500


@quotations_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_quotation(id):
    """Actualiza una cotización concreta con la respuesta del admin (requiere role=admin)."""
    from models import Quotation
    data = request.get_json() or {}

    if 'admin_response' not in data:
        return jsonify({'error': "'admin_response' es obligatorio en el cuerpo de la petición"}), 400

    try:
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Prohibido - se requiere rol de administrador'}), 403

        quotation = Quotation.query.get(id)
        if not quotation:
            return jsonify({'error': f'Cotización con id {id} no encontrada'}), 404

        quotation.admin_response = data.get('admin_response')
        quotation.status = 'Responded'
        db.session.commit()

        return jsonify({'message': 'Cotización actualizada correctamente', 'quotation': quotation.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'No se pudo actualizar la cotización', 'details': str(e)}), 500


@quotations_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_quotation(id):
    """Elimina una cotización por ID (requiere role=admin)."""
    from models import Quotation
    try:
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Prohibido - se requiere rol de administrador'}), 403

        quotation = Quotation.query.get(id)
        if not quotation:
            return jsonify({'error': f'Cotización con id {id} no encontrada'}), 404

        # Eliminar los items asociados primero si existen
        for item in quotation.items:
            db.session.delete(item)
        db.session.delete(quotation)
        db.session.commit()
        return jsonify({'message': 'Cotización eliminada'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'No se pudo eliminar la cotización', 'details': str(e)}), 500
