from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    MYSQL_USER = os.environ.get("MYSQL_USER")
    MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD")
    MYSQL_HOST = os.environ.get("MYSQL_HOST")
    MYSQL_PORT = os.environ.get("MYSQL_PORT")
    DB_NAME = os.environ.get("DB_NAME")

    SQLALCHEMY_DATABASE_URI = (f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{DB_NAME}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)

    CORS_ORIGINS = os.environ.get("CORS_ORIGINS").split(",")




# ----------

# from dotenv import load_dotenv
# import os

# load_dotenv()

# user = os.getenv("MYSQL_USER")
# password = os.getenv("MYSQL_PASSWORD")
# host = os.getenv("MYSQL_HOST")
# database = os.getenv("MYSQL_DB")
# port = os.getenv("MYSQL_PORT", "3307")


# DATABASE_CONNECTION_URI = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"

# --------------

# class Config:
#     SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
#     # Construir la URI de conexión a la base de datos MySQL
#     SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT','3306')}/{os.getenv('MYSQL_DATABASE')}"
#     # Desactivar el seguimiento de modificaciones
#     SQLALCHEMY_TRACK_MODIFICATIONS = False