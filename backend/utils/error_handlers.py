from flask import jsonify

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"message": "Recurso no encontrado"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"message": "Método HTTP no permitido para esta ruta"}), 405

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"message": "Error interno del servidor"}), 500