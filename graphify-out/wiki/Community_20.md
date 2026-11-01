# Community 20

> 23 nodes

## Key Concepts

- **MPU6050** (10 connections) — `hardware/Drivers/mpu6050.py`
- **.read_all()** (5 connections) — `hardware/Drivers/mpu6050.py`
- **2. Architectural Subsystem Breakdown** (5 connections) — `ARCHITECTURE.md`
- **.read_accel()** (4 connections) — `hardware/Drivers/mpu6050.py`
- **.read_temp()** (4 connections) — `hardware/Drivers/mpu6050.py`
- **System Architecture & Component Topology** (4 connections) — `ARCHITECTURE.md`
- **.__init__()** (3 connections) — `hardware/Drivers/mpu6050.py`
- **.read_accel_magnitude()** (3 connections) — `hardware/Drivers/mpu6050.py`
- **.read_gyro()** (3 connections) — `hardware/Drivers/mpu6050.py`
- **._init_sensor()** (2 connections) — `hardware/Drivers/mpu6050.py`
- **._read_word()** (2 connections) — `hardware/Drivers/mpu6050.py`
- **2.1 Hardware Sensing Tier (`hardware/`)** (2 connections) — `ARCHITECTURE.md`
- **I2C** (1 connections)
- **1. High-Level Component Flowchart** (1 connections) — `ARCHITECTURE.md`
- **2.2 Local-First Mobile Companion (`mobile/`)** (1 connections) — `ARCHITECTURE.md`
- **2.3 Express & MongoDB Backend (`backend/`)** (1 connections) — `ARCHITECTURE.md`
- **2.4 Monitoring & Rescue Dashboard (`frontend/`)** (1 connections) — `ARCHITECTURE.md`
- **3. Related Specifications & Architecture Documentation** (1 connections) — `ARCHITECTURE.md`
- **Returns (ax, ay, az) in g.** (1 connections) — `hardware/Drivers/mpu6050.py`
- **Returns (gx, gy, gz) in deg/s.** (1 connections) — `hardware/Drivers/mpu6050.py`
- **Returns temperature in Celsius.** (1 connections) — `hardware/Drivers/mpu6050.py`
- **Returns total acceleration magnitude in g — useful for fall/impact detection.** (1 connections) — `hardware/Drivers/mpu6050.py`
- **Returns a dict with accel, gyro, and temp in one call.** (1 connections) — `hardware/Drivers/mpu6050.py`

## Relationships

- [Community 32](Community_32.md) (1 shared connections)
- [Community 87](Community_87.md) (1 shared connections)

## Source Files

- `ARCHITECTURE.md`
- `hardware/Drivers/mpu6050.py`

## Audit Trail

- EXTRACTED: 29 (97%)
- INFERRED: 1 (3%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*