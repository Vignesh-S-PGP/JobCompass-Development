from flask_jwt_extended import get_jwt, verify_jwt_in_request
from functools import wraps

def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") != role:
                return {"error": "Access denied"}, 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
