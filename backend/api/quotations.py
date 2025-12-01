"""Rutas de cotizaciones."""
import os
from flask import Blueprint, request, jsonify
from app import db, mail
from flask_jwt_extended import jwt_required, get_jwt
from flask_mail import Message

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
            customer_phone=data.get('customer_phone'),
            customer_comments=data.get('customer_comments')
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
        
        print(f"✅ Quotation {id} updated successfully")
        print(f"📧 Email enabled: {os.getenv('ENABLE_EMAIL', 'False')}")

        # Enviar email al cliente con la respuesta (deshabilitado temporalmente)
        # TODO: Configurar servicio de email alternativo (SendGrid, Mailgun, etc.)
        email_enabled = os.getenv('ENABLE_EMAIL', 'False') == 'True'
        
        if not email_enabled:
            print("ℹ️ Email sending is disabled")
            return jsonify({'message': 'Cotización actualizada correctamente', 'quotation': quotation.serialize()}), 200
        
        try:
            import os
            sender_email = os.getenv('MAIL_DEFAULT_SENDER') or os.getenv('MAIL_USERNAME')
            
            # Verificar que tenemos las credenciales necesarias
            if not sender_email or not os.getenv('MAIL_PASSWORD'):
                print("⚠️ Email credentials not configured, skipping email send")
                return jsonify({'message': 'Cotización actualizada (email no configurado)', 'quotation': quotation.serialize()}), 200
            
            msg = Message(
                subject='Respuesta a tu cotización - Envatex',
                sender=sender_email,
                recipients=[quotation.customer_email]
            )
            
            # Construir lista de productos
            products_html = ""
            for item in quotation.items:
                products_html += f"""
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">{item.product.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">{item.quantity}</td>
                </tr>
                """
            
            # URL del logo (desde el frontend desplegado o localhost en desarrollo)
            frontend_url = os.getenv('FRONTEND_URL', 'https://envatex-frontend.onrender.com')
            logo_url = f"{frontend_url}/2.png"
            
            msg.html = f"""
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9fafb;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <!-- Header con logo -->
                        <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%); padding: 30px 20px; border-radius: 12px 12px 0 0;">
                            <img src="{logo_url}" alt="Envatex Logo" style="max-width: 150px; height: auto; margin-bottom: 15px;" />
                            <h2 style="color: white; margin: 0; font-size: 24px;">Respuesta a tu cotización</h2>
                        </div>
                        
                        <!-- Contenido principal -->
                        <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <p style="font-size: 16px;">Hola <strong style="color: #2563eb;">{quotation.customer_name}</strong>,</p>
                            <p>Hemos revisado tu solicitud de cotización y tenemos una respuesta para ti:</p>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <strong>Respuesta del administrador:</strong>
                            <p style="margin-top: 10px;">{quotation.admin_response}</p>
                        </div>
                        
                        <h3 style="color: #475569; margin-top: 30px;">Productos solicitados:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                            <thead>
                                <tr style="background-color: #64748b; color: white;">
                                    <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Producto</th>
                                    <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products_html}
                            </tbody>
                        </table>
                        
                            {f'<div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #3b82f6;"><p style="margin: 0;"><strong>Tus comentarios:</strong> {quotation.customer_comments}</p></div>' if quotation.customer_comments else ''}
                            
                            <p style="margin-top: 30px; font-size: 15px;">Si tienes alguna pregunta adicional, no dudes en contactarnos.</p>
                            
                            <!-- Footer -->
                            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
                                <img src="{logo_url}" alt="Envatex" style="max-width: 100px; height: auto; margin-bottom: 10px; opacity: 0.8;" />
                                <p style="color: #9ca3af; margin: 0; font-size: 13px;">Tu proveedor de confianza en envases y embalajes</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            mail.send(msg)
            print(f"✅ Email sent successfully to {quotation.customer_email}")
            return jsonify({'message': 'Cotización actualizada y email enviado correctamente', 'quotation': quotation.serialize()}), 200
        except Exception as email_error:
            # Si falla el email, log pero no fallar la actualización
            print(f"⚠️ Error sending email: {email_error}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Cotización actualizada (error al enviar email)', 'quotation': quotation.serialize()}), 200

    except Exception as e:
        print(f"❌ Error updating quotation: {e}")
        import traceback
        traceback.print_exc()
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
