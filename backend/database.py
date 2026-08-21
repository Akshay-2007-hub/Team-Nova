from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./vayu_mitra.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    particle_count = Column(Integer)
    scatter_percentage = Column(Float)
    brightness = Column(Float)
    optical_anomaly_score = Column(Float)
    risk_score = Column(Integer)
    pm25 = Column(Float)
    weather_temperature = Column(Float, nullable=True)
    weather_windspeed = Column(Float, nullable=True)

Base.metadata.create_all(bind=engine)
