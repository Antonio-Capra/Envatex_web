"""Rutas de productos."""
from flask import Blueprint, request, jsonify
from app import db
import cloudinary.uploader
from flask_jwt_extended import jwt_required, get_jwt

products_bp = Blueprint('products', __name__, url_prefix='/api/products')


@products_bp.route('', methods=['GET'])
def get_products():
    """Devuelve la lista de productos."""
    from models import Product
    products = Product.query.all()
    return jsonify([p.serialize() for p in products]), 200


@products_bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    """Crea un nuevo producto (requiere role=admin)."""
    from models import Product
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Prohibido - se requiere rol de administrador'}), 403

    name = request.form.get('name')
    description = request.form.get('description')
    sku = request.form.get('sku')
    image_url = None

    # Subir imagen si viene en request.files['image']
    image_file = request.files.get('image')
    if image_file:
        try:
            upload_res = cloudinary.uploader.upload(image_file)
            image_url = upload_res.get('secure_url')
        except Exception as e:
            return jsonify({'error': 'No se pudo subir la imagen', 'details': str(e)}), 500
    else:
        image_url = request.form.get('image_url')

    if not name:
        return jsonify({'error': 'El nombre es obligatorio'}), 400

    # Verificar unicidad de name y sku
    existing_product = Product.query.filter((Product.name == name) | (Product.sku == sku)).first()
    if existing_product:
        return jsonify({'error': 'Ya existe un producto con el mismo nombre o SKU'}), 400

    try:
        p = Product(name=name, image_url=image_url, description=description, sku=sku)
        db.session.add(p)
        db.session.commit()
        return jsonify({'message': 'Producto creado', 'product': p.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'No se pudo crear el producto', 'details': str(e)}), 500


@products_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    """Actualiza un producto por id (requiere role=admin)."""
    from models import Product
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Prohibido - se requiere rol de administrador'}), 403

    try:
        p = Product.query.get(id)
        if not p:
            return jsonify({'error': f'Producto con id {id} no encontrado'}), 404

        # Aceptar multipart/form-data para actualización
        name = request.form.get('name')
        description = request.form.get('description')
        sku = request.form.get('sku')

        if name:
            p.name = name
        if description:
            p.description = description
        if sku:
            p.sku = sku

        image_file = request.files.get('image')
        if image_file:
            try:
                upload_res = cloudinary.uploader.upload(image_file)
                p.image_url = upload_res.get('secure_url')
            except Exception as e:
                db.session.rollback()
                return jsonify({'error': 'No se pudo subir la imagen', 'details': str(e)}), 500
        else:
            # Si se envía image_url en el formulario (por compatibilidad), actualizarla
            image_url = request.form.get('image_url')
            if image_url:
                p.image_url = image_url

        db.session.commit()
        return jsonify({'message': 'Producto actualizado', 'product': p.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'No se pudo actualizar el producto', 'details': str(e)}), 500


@products_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    """Elimina un producto por id (requiere role=admin)."""
    from models import Product
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Prohibido - se requiere rol de administrador'}), 403

    try:
        p = Product.query.get(id)
        if not p:
            return jsonify({'error': f'Producto con id {id} no encontrado'}), 404

        db.session.delete(p)
        db.session.commit()
        return jsonify({'message': 'Producto eliminado'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'No se pudo eliminar el producto', 'details': str(e)}), 500
