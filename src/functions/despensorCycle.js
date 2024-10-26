import rpio from 'rpio';

// Configurable Constants
const TASTE1_PUMP_PIN = 37;           // Pin for Taste 1 Pump (GPIO 27)
const TASTE2_PUMP_PIN = 35;           // Pin for Taste 2 Pump (GPIO 22)
const TASTE3_PUMP_PIN = 33;           // Pin for Taste 3 Pump (GPIO 23)
const SOLENOID_VALVE_PIN = 31;        // Pin for Solenoid Valve (Fresh Water Control)
const FLOW_SENSOR_PIN = 36;           // Pin for Flow Sensor (GPIO 24)
const FLOW_PULSE_VOLUME = 110;        // Volume per flow pulse in milliliters
const TARGET_VOLUME = 200;            // Fixed target dispensing volume in milliliters
const FLOW_TIMEOUT_DURATION = 15000;  // Duration in ms to wait for a pulse before error
const TASTE_PUMP_DURATION = 10000;     // Dosing time for each taste pump in milliseconds (e.g., 3000ms = 3 seconds)

let flowPulseCount = 0;
let dispensedVolume = 0;
let flowTimeout;
let isSolenoidActive = false;
let isPumpActive = false;

// Initialize each pump and solenoid pin
rpio.open(TASTE1_PUMP_PIN, rpio.OUTPUT, rpio.LOW);
rpio.open(TASTE2_PUMP_PIN, rpio.OUTPUT, rpio.LOW);
rpio.open(TASTE3_PUMP_PIN, rpio.OUTPUT, rpio.LOW);
rpio.open(SOLENOID_VALVE_PIN, rpio.OUTPUT, rpio.LOW);

// Function to start a timeout to monitor flow sensor inactivity
const startFlowTimeout = () => {
    flowTimeout = setTimeout(() => {
        console.error("No flow detected for 15 seconds. Stopping all operations.");
        deactivateAllPumpsAndValve();
    }, FLOW_TIMEOUT_DURATION);
};

// Function to run the solenoid valve and flow sensor
const runSolenoidValve = () => {
    console.log("Activating solenoid valve for fresh water...");
    rpio.write(SOLENOID_VALVE_PIN, rpio.HIGH);
    isSolenoidActive = true;

    // Set up flow sensor polling and pulse handling
    const pulseHandler = () => {
        const value = rpio.read(FLOW_SENSOR_PIN);
        if (value) {
            flowPulseCount++;
            dispensedVolume = flowPulseCount * FLOW_PULSE_VOLUME;
            console.log(`Flow pulse detected. Total pulses: ${flowPulseCount}`);
            console.log(`Dispensing... Current volume: ${dispensedVolume}ml`);

            // Reset the flow timeout each time a pulse is detected
            clearTimeout(flowTimeout);
            startFlowTimeout();

            if (dispensedVolume >= TARGET_VOLUME) {
                console.log("Target volume dispensed. Stopping the solenoid valve.");
                deactivateAllPumpsAndValve();
            }
        }
    };

    // Begin polling the flow sensor
    rpio.poll(FLOW_SENSOR_PIN, pulseHandler);
    startFlowTimeout();
};

// Main dispensing cycle function for taste pumps
export function despensorCycle(tasteInput) {
    console.log("Starting despensorCycle for " + tasteInput);

    // Run the solenoid valve for fresh water
    runSolenoidValve();

    // Map the taste input to the corresponding pump pin and activate for fixed duration
    const TASTE_PUMP_MAP = {
        'Taste_1': TASTE1_PUMP_PIN,
        'Taste_2': TASTE2_PUMP_PIN,
        'Taste_3': TASTE3_PUMP_PIN,
    };
    const selectedPumpPin = TASTE_PUMP_MAP[tasteInput];

    if (!selectedPumpPin) {
        console.error("Invalid taste input specified.");
        return;
    }

    // Activate the selected taste pump for a set time (dosing duration)
    console.log(`Activating pump for ${tasteInput} on pin ${selectedPumpPin} for ${TASTE_PUMP_DURATION}ms`);
    rpio.write(selectedPumpPin, rpio.HIGH);
    isPumpActive = true;

    // Turn off the taste pump after the set duration
    setTimeout(() => {
        console.log(`Deactivating taste pump for ${tasteInput}`);
        rpio.write(selectedPumpPin, rpio.LOW);
        isPumpActive = false;
    }, TASTE_PUMP_DURATION);
}

function deactivateAllPumpsAndValve() {
    if (isPumpActive || isSolenoidActive) {
        console.log("Deactivating all pumps and solenoid valve.");

        // Deactivate all pumps and solenoid
        rpio.write(TASTE1_PUMP_PIN, rpio.LOW);
        rpio.write(TASTE2_PUMP_PIN, rpio.LOW);
        rpio.write(TASTE3_PUMP_PIN, rpio.LOW);
        rpio.write(SOLENOID_VALVE_PIN, rpio.LOW);

        // Reset flags and counts
        isPumpActive = false;
        isSolenoidActive = false;
        flowPulseCount = 0;
        dispensedVolume = 0;

        // Stop polling the flow sensor and clear the timeout
        rpio.poll(FLOW_SENSOR_PIN, null);
        clearTimeout(flowTimeout);

        console.log("All systems reset: flow counts, volume, timeout, and pump states.");
    }
}

// Export deactivateAllPumpsAndValve to use elsewhere if needed
export { deactivateAllPumpsAndValve };
