"""
Admin API-key dependency for protected routes.
Pass `X-Admin-Key: <value>` header on every protected request.
The key is read from the ADMIN_SECRET_KEY environment variable
(defaults to "cart-admin-secret" for local development).
"""

from fastapi import Header, HTTPException, status
from app.config import settings


async def require_admin(x_admin_key: str = Header(default="")) -> None:
    """FastAPI dependency — raises 403 if the admin key doesn't match."""
    expected = getattr(settings, "ADMIN_SECRET_KEY", "cart-admin-secret")
    if not x_admin_key or x_admin_key != expected:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing X-Admin-Key header.",
        )
