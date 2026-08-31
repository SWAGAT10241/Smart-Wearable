"""
SX1278 (Ra-02) LoRa driver for MicroPython (ESP32-S3)
SPI-based. Supports basic blocking TX and RX (polled, not interrupt-driven).

Wiring (adjust to your actual pins):
    SCK  -> SPI SCK
    MISO -> SPI MISO
    MOSI -> SPI MOSI
    NSS/CS -> any GPIO (chip select)
    RST    -> any GPIO (reset)
    DIO0   -> any GPIO (TX/RX done interrupt flag, polled here)

Usage:
    from machine import SPI, Pin
    from sx1278 import SX1278

    spi = SPI(2, baudrate=5000000, polarity=0, phase=0,
              sck=Pin(12), mosi=Pin(11), miso=Pin(13))
    cs = Pin(10, Pin.OUT)
    rst = Pin(14, Pin.OUT)
    dio0 = Pin(15, Pin.IN)

    lora = SX1278(spi, cs, rst, dio0, freq=433.0)

    lora.send(b"hello")

    packet = lora.receive(timeout_ms=2000)
    if packet:
        print(packet)
"""

from machine import Pin
import time

class SX1278:
    # Register addresses
    _REG_FIFO                 = 0x00
    _REG_OP_MODE               = 0x01
    _REG_FRF_MSB                = 0x06
    _REG_FRF_MID                = 0x07
    _REG_FRF_LSB                = 0x08
    _REG_PA_CONFIG              = 0x09
    _REG_LNA                    = 0x0C
    _REG_FIFO_ADDR_PTR          = 0x0D
    _REG_FIFO_TX_BASE_ADDR      = 0x0E
    _REG_FIFO_RX_BASE_ADDR      = 0x0F
    _REG_FIFO_RX_CURRENT_ADDR   = 0x10
    _REG_IRQ_FLAGS              = 0x12
    _REG_RX_NB_BYTES            = 0x13
    _REG_PKT_SNR_VALUE          = 0x19
    _REG_PKT_RSSI_VALUE         = 0x1A
    _REG_MODEM_CONFIG_1         = 0x1D
    _REG_MODEM_CONFIG_2         = 0x1E
    _REG_PREAMBLE_MSB           = 0x20
    _REG_PREAMBLE_LSB           = 0x21
    _REG_PAYLOAD_LENGTH         = 0x22
    _REG_MODEM_CONFIG_3         = 0x26
    _REG_DIO_MAPPING_1          = 0x40
    _REG_VERSION                = 0x42
    _REG_PA_DAC                 = 0x4D

    # Modes
    _MODE_LONG_RANGE_MODE = 0x80
    _MODE_SLEEP    = 0x00
    _MODE_STDBY    = 0x01
    _MODE_TX       = 0x03
    _MODE_RX_CONT  = 0x05

    _IRQ_TX_DONE_MASK   = 0x08
    _IRQ_RX_DONE_MASK   = 0x40
    _IRQ_PAYLOAD_CRC_ERROR_MASK = 0x20

    def __init__(self, spi, cs: Pin, rst: Pin, dio0: Pin, freq: float = 433.0):
        self.spi = spi
        self.cs = cs
        self.rst = rst
        self.dio0 = dio0

        self.cs.init(Pin.OUT, value=1)
        self.rst.init(Pin.OUT, value=1)
        self.dio0.init(Pin.IN)

        self._reset()
        self._init_sensor(freq)

    # ---------- low-level register access ----------

    def _write_reg(self, addr, value):
        self.cs.value(0)
        self.spi.write(bytes([addr | 0x80, value]))
        self.cs.value(1)

    def _read_reg(self, addr):
        self.cs.value(0)
        self.spi.write(bytes([addr & 0x7F]))
        result = self.spi.read(1)
        self.cs.value(1)
        return result[0]

    def _write_fifo(self, data):
        self.cs.value(0)
        self.spi.write(bytes([self._REG_FIFO | 0x80]) + data)
        self.cs.value(1)

    def _read_fifo(self, length):
        self.cs.value(0)
        self.spi.write(bytes([self._REG_FIFO & 0x7F]))
        result = self.spi.read(length)
        self.cs.value(1)
        return result

    def _reset(self):
        self.rst.value(0)
        time.sleep_ms(10)
        self.rst.value(1)
        time.sleep_ms(10)

    # ---------- init ----------

    def _init_sensor(self, freq):
        version = self._read_reg(self._REG_VERSION)
        if version != 0x12:
            raise OSError("SX1278 not found (version=0x{:02X}, expected 0x12)".format(version))

        self._sleep()

        # Set frequency
        frf = int((freq * 1000000.0) / 61.03515625)
        self._write_reg(self._REG_FRF_MSB, (frf >> 16) & 0xFF)
        self._write_reg(self._REG_FRF_MID, (frf >> 8) & 0xFF)
        self._write_reg(self._REG_FRF_LSB, frf & 0xFF)

        # FIFO base addresses
        self._write_reg(self._REG_FIFO_TX_BASE_ADDR, 0x00)
        self._write_reg(self._REG_FIFO_RX_BASE_ADDR, 0x00)

        # LNA boost
        self._write_reg(self._REG_LNA, self._read_reg(self._REG_LNA) | 0x03)

        # Modem config: BW 125kHz, CR 4/5, explicit header mode
        self._write_reg(self._REG_MODEM_CONFIG_1, 0x72)
        # SF7, CRC on
        self._write_reg(self._REG_MODEM_CONFIG_2, 0x74)
        # Low data rate optimize off, AGC auto on
        self._write_reg(self._REG_MODEM_CONFIG_3, 0x04)

        # Preamble length
        self._write_reg(self._REG_PREAMBLE_MSB, 0x00)
        self._write_reg(self._REG_PREAMBLE_LSB, 0x08)

        # PA config: PA_BOOST pin, max power
        self._write_reg(self._REG_PA_CONFIG, 0x8F)
        self._write_reg(self._REG_PA_DAC, 0x87)  # enable +20dBm on PA_BOOST

        self._standby()

    def _sleep(self):
        self._write_reg(self._REG_OP_MODE, self._MODE_LONG_RANGE_MODE | self._MODE_SLEEP)

    def _standby(self):
        self._write_reg(self._REG_OP_MODE, self._MODE_LONG_RANGE_MODE | self._MODE_STDBY)

    # ---------- public API ----------

    def send(self, data: bytes, timeout_ms: int = 2000):
        """Blocking send. Returns True if TX completed, False on timeout."""
        if isinstance(data, str):
            data = data.encode()

        self._standby()
        self._write_reg(self._REG_FIFO_ADDR_PTR, 0x00)
        self._write_fifo(data)
        self._write_reg(self._REG_PAYLOAD_LENGTH, len(data))

        # Map DIO0 to TxDone
        self._write_reg(self._REG_DIO_MAPPING_1, 0x40)
        self._write_reg(self._REG_OP_MODE, self._MODE_LONG_RANGE_MODE | self._MODE_TX)

        start = time.ticks_ms()
        while not self.dio0.value():
            if time.ticks_diff(time.ticks_ms(), start) > timeout_ms:
                self._standby()
                return False
            time.sleep_ms(2)

        self._write_reg(self._REG_IRQ_FLAGS, self._IRQ_TX_DONE_MASK)  # clear flag
        self._standby()
        return True

    def receive(self, timeout_ms: int = 0):
        """Puts radio in continuous RX mode and waits for a packet.
        timeout_ms=0 blocks forever; otherwise returns None on timeout.
        Returns bytes payload, or None."""
        # Map DIO0 to RxDone
        self._write_reg(self._REG_DIO_MAPPING_1, 0x00)
        self._write_reg(self._REG_OP_MODE, self._MODE_LONG_RANGE_MODE | self._MODE_RX_CONT)

        start = time.ticks_ms()
        while not self.dio0.value():
            if timeout_ms and time.ticks_diff(time.ticks_ms(), start) > timeout_ms:
                self._standby()
                return None
            time.sleep_ms(2)

        irq_flags = self._read_reg(self._REG_IRQ_FLAGS)
        self._write_reg(self._REG_IRQ_FLAGS, irq_flags)  # clear all flags

        if irq_flags & self._IRQ_PAYLOAD_CRC_ERROR_MASK:
            self._standby()
            return None

        current_addr = self._read_reg(self._REG_FIFO_RX_CURRENT_ADDR)
        length = self._read_reg(self._REG_RX_NB_BYTES)

        self._write_reg(self._REG_FIFO_ADDR_PTR, current_addr)
        payload = self._read_fifo(length)

        self._standby()
        return payload

    def rssi(self):
        """Returns RSSI of last received packet, in dBm."""
        return self._read_reg(self._REG_PKT_RSSI_VALUE) - 137

    def snr(self):
        """Returns SNR of last received packet, in dB."""
        val = self._read_reg(self._REG_PKT_SNR_VALUE)
        if val > 127:
            val -= 256
        return val / 4.0
