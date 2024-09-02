import rpio from 'rpio';

// Configurable Constants
const TASTE1_PUMP_PIN = 37;           // Pin for Taste 1 Pump (GPIO 27)
const TASTE2_PUMP_PIN = 35;           // Pin for Taste 2 Pump (GPIO 22)
const TASTE3_PUMP_PIN = 33;           // Pin for Taste 3 Pump (GPIO 23)

const CUP_SENSOR_PIN = 11;            // Pin for Cup Sensor (GPIO 17)
const CAN_SENSOR_PIN = 12;            // Pin for Can Sensor (GPIO 18)

const SOLENOID_VALVE_PIN = 31;         // Pin for Solenoid Valve (GPIO 4)

const FLOW_SENSOR_PIN = 18;           // Pin for Flow Sensor (GPIO 24)
const FLOW_PULSE_VOLUME = 100;        // Volume per flow pulse in milliliters
const TARGET_VOLUME = 500;            // Target dispensing volume in milliliters
const FLOW_TIMEOUT_DURATION = 15000;  // Duration in ms to wait for a pulse before error

// GPIO setup
rpio.open(SOLENOID_VALVE_PIN, rpio.OUTPUT, rpio.LOW);
rpio.open(TASTE1_PUMP_PIN, rpio.OUTPUT, rpio.LOW);
rpio.open(TASTE2_PUMP_PIN, rpio.OUTPUT, rpio.LOW);
rpio.open(TASTE3_PUMP_PIN, rpio.OUTPUT, rpio.LOW);
rpio.open(FLOW_SENSOR_PIN, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(CUP_SENSOR_PIN, rpio.INPUT);
rpio.open(CAN_SENSOR_PIN, rpio.INPUT);

let flowPulseCount = 0;
let dispensedVolume = 0;
let flowTimeout;

function deactivateAllPumps() {
  console.log("Deactivating all pumps and solenoid valve.");
  rpio.write(SOLENOID_VALVE_PIN, rpio.LOW);
  rpio.write(TASTE1_PUMP_PIN, rpio.LOW);
  rpio.write(TASTE2_PUMP_PIN, rpio.LOW);
  rpio.write(TASTE3_PUMP_PIN, rpio.LOW);

  // Stop polling the flow sensor and clear the timeout
  rpio.poll(FLOW_SENSOR_PIN, null);
  clearTimeout(flowTimeout);
}

function checkForCanOrCup() {
  const canSensorValue = rpio.read(CAN_SENSOR_PIN);
  const cupSensorValue = rpio.read(CUP_SENSOR_PIN);

  if (canSensorValue === 0 && cupSensorValue === 0) {
    console.log("No can or cup detected. Stopping all operations.");
    deactivateAllPumps();
    return false; // Indicates that no can or cup is present
  }

  return true; // Can or cup is present
}

export function despensorCycle(tasteInput) {
  console.log("despensorCycle " + tasteInput);

  // Reset flow pulse count and dispensed volume
  flowPulseCount = 0;
  dispensedVolume = 0;

  // Map for taste inputs to pump pins
  const TASTE_PUMP_MAP = {
    'Taste_1': TASTE1_PUMP_PIN,
    'Taste_2': TASTE2_PUMP_PIN,
    'Taste_3': TASTE3_PUMP_PIN,
  };

  // Function to handle flow sensor pulses
  const pulseHandler = () => {
    const value = rpio.read(FLOW_SENSOR_PIN);
    if (value) {
      flowPulseCount++;
      dispensedVolume = flowPulseCount * FLOW_PULSE_VOLUME;
      console.log(`Flow pulse detected. Total pulses: ${flowPulseCount}`);
      console.log(`Dispensing... Current volume: ${dispensedVolume}ml`);
      // Reset the flow timeout whenever a pulse is detected
      clearTimeout(flowTimeout);
      startFlowTimeout();
      // Check if the target volume has been dispensed
      if (dispensedVolume >= TARGET_VOLUME) {
        console.log("Target volume dispensed. Stopping the pumps and solenoid valve.");
        deactivateAllPumps(); // Deactivate pumps and stop polling
      }
    }
  };

  // Function to start or restart the flow timeout
  const startFlowTimeout = () => {
    flowTimeout = setTimeout(() => {
      console.error("No flow detected for 15 seconds. Stopping all operations.");
      deactivateAllPumps(); // Deactivate pumps and stop polling
    }, FLOW_TIMEOUT_DURATION); // 15 seconds timeout
  };

  try {
    // Start the solenoid valve
    console.log("Starting the solenoid valve...");
    rpio.write(SOLENOID_VALVE_PIN, rpio.HIGH); // Turn on the solenoid valve

    // Check for can or cup placement
    if (!checkForCanOrCup()) {
      throw new Error("No can or cup detected. Stopping the process.");
    }

    // Select the correct taste pump based on the input
    const selectedPumpPin = TASTE_PUMP_MAP[tasteInput];
    if (!selectedPumpPin) {
      throw new Error("Unknown taste input!");
    }

    console.log(`Activating pump for ${tasteInput} on pin ${selectedPumpPin}`);
    rpio.write(selectedPumpPin, rpio.HIGH); // Turn on the selected pump

    // Start polling for flow sensor pulses
    rpio.poll(FLOW_SENSOR_PIN, pulseHandler);

    // Start monitoring flow timeout
    startFlowTimeout();

  } catch (error) {
    console.error("Error during machine process:", error.message);
    deactivateAllPumps();  // Ensure pumps are deactivated if there's an error
  }
}
