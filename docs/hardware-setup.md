# Hardware Setup Guide

## Components Required

### Main Components

1. **NodeMCU ESP8266** (1x)

   - Microcontroller with WiFi capability
   - Operating voltage: 3.3V
   - Input voltage: 5V via USB or VIN pin

2. **TDS Sensor** (1x)

   - Measures Total Dissolved Solids in water
   - Operating voltage: 3.3V - 5.5V
   - Output: Analog signal (0-3.3V)

3. **IR Sensor Module** (1x)

   - Detects black/white strips on turbine
   - Operating voltage: 3.3V - 5V
   - Output: Digital signal (HIGH/LOW)

4. **Water Flow Turbine** (1x)
   - Mechanical sensor with rotating wheel
   - Modified with black and white strips
   - Typical size: 1/2" or 3/4" pipe fitting

### Additional Components

- Jumper wires (Male-to-Female, Male-to-Male)
- Breadboard (optional, for prototyping)
- LED (for status indication)
- 220Ω resistor (for LED)
- USB cable (for programming and power)
- 5V power adapter (for standalone operation)

## Circuit Diagram

```
NodeMCU ESP8266                    TDS Sensor
    ┌─────────┐                   ┌────────┐
    │         │                   │        │
    │     3.3V├───────────────────┤ VCC    │
    │      GND├───────────────────┤ GND    │
    │       A0├───────────────────┤ OUT    │
    │         │                   └────────┘
    │         │
    │         │                   IR Sensor
    │         │                   ┌────────┐
    │      D5 ├───────────────────┤ OUT    │
    │     3.3V├───────────────────┤ VCC    │
    │      GND├───────────────────┤ GND    │
    │         │                   └────────┘
    │         │
    │         │                   LED
    │      D4 ├────[220Ω]────┬────[LED]────GND
    │         │               │
    └─────────┘               └─────(+)─────(-)
```

## Step-by-Step Connection Guide

### Step 1: TDS Sensor Connection

1. **VCC (Red wire)**: Connect to 3.3V pin on NodeMCU
2. **GND (Black wire)**: Connect to GND pin on NodeMCU
3. **OUT/Signal (Blue/Yellow wire)**: Connect to A0 pin on NodeMCU

> ⚠️ **Important**: The NodeMCU's ADC (A0) can only handle 0-1V. Many TDS sensors output 0-3.3V or 0-5V. You may need a voltage divider if your sensor outputs more than 1V. Use two resistors (e.g., 100kΩ and 220kΩ) to create a voltage divider.

**Voltage Divider Circuit (if needed)**:

```
TDS OUT ──[220kΩ]──┬──[100kΩ]── GND
                   │
                   └── A0 (NodeMCU)
```

### Step 2: IR Sensor Connection

1. **VCC**: Connect to 3.3V or 5V pin on NodeMCU
2. **GND**: Connect to GND pin on NodeMCU
3. **OUT**: Connect to D5 pin on NodeMCU

> 💡 **Tip**: Some IR sensors have a potentiometer to adjust sensitivity. Adjust it so the sensor reliably detects the black and white strips.

### Step 3: LED Indicator Connection

1. Connect long leg (anode, +) of LED to D4 through a 220Ω resistor
2. Connect short leg (cathode, -) of LED to GND

### Step 4: Turbine Modification

1. **Mark the turbine wheel** with alternating black and white strips:

   - Use permanent marker or paint
   - Create 4-8 strips for better accuracy
   - Ensure high contrast between black and white

2. **Position the IR sensor**:

   - Mount 2-5mm away from the marked wheel
   - Align sensor perpendicular to the strips
   - Secure with hot glue or mounting bracket

3. **Install turbine in pipe**:
   - Use appropriate pipe fittings
   - Ensure flow direction matches arrow on turbine
   - Seal connections to prevent leaks

## Mounting Recommendations

### Option 1: Breadboard Prototype

- Good for testing and development
- Easy to modify connections
- Not suitable for permanent installation

### Option 2: Perfboard/PCB

- More permanent solution
- Better for deployment
- Solder connections for reliability

### Option 3: Enclosure

- Protect electronics from water
- Use waterproof junction box
- Ensure ventilation to prevent condensation

## Power Supply Options

### USB Power (Development)

- Connect NodeMCU to computer via USB cable
- Good for programming and testing
- Not suitable for permanent installation

### 5V Adapter (Production)

- Use 5V 1A+ power adapter
- Connect to VIN pin on NodeMCU
- More reliable for 24/7 operation

### Battery Power (Portable)

- Use 3.7V Li-ion battery with boost converter
- Or 4x AA batteries (6V) with voltage regulator
- Good for remote locations

## Sensor Positioning

### TDS Sensor

- Install **after** any filtration
- Ensure sensor is fully submerged
- Keep away from air bubbles
- Clean regularly to prevent scaling

### IR Sensor

- **Distance from strips**: 2-5mm optimal
- **Alignment**: Perpendicular to rotation
- **Protection**: Shield from direct water spray
- **Ambient light**: Cover to reduce interference

### Turbine

- Install in **horizontal** pipe section if possible
- Ensure **straight pipe** before and after (10x diameter)
- **Flow direction**: Follow arrow on turbine body
- **Bypass valve**: Install for maintenance access

## Testing Procedure

### Step 1: Visual Inspection

- Check all connections
- Verify polarity (VCC and GND)
- Ensure no shorts between wires

### Step 2: Power On

- Connect USB to NodeMCU
- LED should blink during startup
- Check Serial Monitor for boot messages

### Step 3: TDS Sensor Test

- Open Serial Monitor (115200 baud)
- Look for TDS readings
- Test with different water samples

### Step 4: Flow Sensor Test

- Manually spin turbine
- Observe pulse count in Serial Monitor
- Verify interrupts are working

### Step 5: WiFi Connection Test

- Verify connection to WiFi network
- Check IP address assignment
- Ping NodeMCU from computer

### Step 6: Cloud Connection Test

- Verify Firebase connection
- Check data upload in Firebase console
- Confirm ThingSpeak updates (if used)

## Troubleshooting Hardware Issues

### TDS Sensor Issues

**Problem**: Reading always zero

- Check wiring connections
- Verify sensor is submerged
- Test sensor with multimeter (should output 0-1V)

**Problem**: Erratic readings

- Clean sensor probe (white vinegar soak)
- Check for loose connections
- Shield wires from electrical noise

**Problem**: Reading too high/low

- Calibrate with known TDS solution
- Adjust calibration factor in code
- Check sensor age (probes degrade over time)

### Flow Sensor Issues

**Problem**: No pulses detected

- Check IR sensor LED (should be visible with camera)
- Adjust sensor distance (2-5mm optimal)
- Verify strip contrast
- Test with slow manual rotation

**Problem**: Inconsistent pulses

- Reduce ambient light interference
- Adjust sensitivity potentiometer
- Check for vibrations
- Ensure stable mounting

**Problem**: Pulses too fast/slow

- Adjust calibration factor
- Verify flow direction
- Check for turbine obstruction

### NodeMCU Issues

**Problem**: Not powering on

- Check USB cable (try different cable)
- Verify power adapter voltage
- Check for short circuits

**Problem**: Not connecting to WiFi

- Verify 2.4GHz network (not 5GHz)
- Check SSID and password
- Move closer to router
- Check router firewall settings

**Problem**: Random resets

- Check power supply current (need 500mA+)
- Reduce connected components
- Add capacitor (100µF) between VCC and GND

## Safety Considerations

1. **Electrical Safety**

   - Use GFCI outlet if near water
   - Seal all connections
   - Avoid exposed conductors

2. **Water Protection**

   - Use waterproof enclosure
   - Seal cable entries with silicone
   - Position above water level if possible

3. **Maintenance Access**

   - Install bypass valve
   - Allow space for sensor removal
   - Label all components

4. **Grounding**
   - Properly ground power supply
   - Use isolated power adapter
   - Avoid metal enclosures without proper grounding

## Maintenance Schedule

### Weekly

- Check LED status indicator
- Verify dashboard connectivity

### Monthly

- Clean TDS sensor probe
- Check turbine for debris
- Inspect wiring connections

### Quarterly

- Calibrate TDS sensor
- Calibrate flow sensor
- Test backup/notifications

### Annually

- Replace TDS sensor probe if needed
- Check turbine bearings
- Update firmware

## Next Steps

After hardware setup:

1. Upload Arduino code
2. Configure WiFi credentials
3. Set up Firebase
4. Deploy web dashboard
5. Calibrate sensors
6. Test full system

Refer to `calibration-guide.md` for detailed calibration instructions.
