from machine import Pin, SPI
from ili9341 import Display, color565
from xglcd_font import XglcdFont
from machine import Pin, PWM

backlight = PWM(Pin(20), freq=1000, duty_u16=32768)

# 1. Initialize SPI and Display (Example for RPi Pico)
spi = SPI(1, baudrate=40000000, mosi=Pin(41), sck=Pin(38))
display = Display(spi, dc=Pin(39), cs=Pin(10), rst=Pin(40))

# 2. Load the .c font file
# Replace 'Unispace12x24.c' with your actual filename
# Ensure width and height match the font's specification
print('Loading font...')
my_font = XglcdFont('Unispace12x24.c', 12, 24)

# 3. Clear screen and draw text
display.clear(color565(0, 0, 128))  # Dark Blue background
display.draw_text(10, 50, 'Hello World!', my_font, color565(255, 255, 255))

print('Done!')
