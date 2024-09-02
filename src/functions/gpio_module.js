import { Gpio } from 'pigpio';
import { sensors, temperature } from 'ds18b20';

// GPIO Pin Setup
const Can_Sensor = new Gpio(18, { mode: Gpio.INPUT }); // GPIO 18 (physical pin 12)
const Cup_Sensor = new Gpio(17, { mode: Gpio.INPUT }); // GPIO 17 (physical pin 11)
const Temp_Sensor = new Gpio(4, { mode: Gpio.INPUT }); // Replace with your GPIO pin (if needed for another purpose)

let previousCanSensorValue = Can_Sensor.digitalRead();
let previousCupSensorValue = Cup_Sensor.digitalRead();

// Function to check sensors and log placement of CAN or CUP
function checkForCanOrCup(callback) {
    function log(message) {
        const logMessage = `[GPIO] ${message}`;
        console.log(logMessage);
        callback(logMessage); // Send the log message to the SSE endpoint
    }

    function checkSensors() {
        const CanSensorValue = Can_Sensor.digitalRead();
        const CupSensorValue = Cup_Sensor.digitalRead();

        if (CanSensorValue !== previousCanSensorValue || CupSensorValue !== previousCupSensorValue) {
            if (CanSensorValue === 1 && CupSensorValue === 1) {
                log('CAN is placed');
            } else if (CanSensorValue === 1) {
                log('CUP is placed');
            } else {
                log('Nothing is placed');
            }

            previousCanSensorValue = CanSensorValue;
            previousCupSensorValue = CupSensorValue;
        }
    }

    setInterval(checkSensors, 500); // Check every 500ms
}

// Function to read temperature from DS18B20 sensor
let deviceId;

sensors((err, ids) => {
    if (err) {
        console.error('Error detecting sensor:', err);
        return;
    }

    deviceId = ids[0]; // Assuming you have only one sensor connected
});

function readTemperature(callback) {
    if (!deviceId) {
        const error = 'Temperature sensor not initialized';
        console.error(error);
        callback(error, null);
        return;
    }

    temperature(deviceId, (err, temp) => {
        if (err) {
            console.error('Error reading temperature:', err);
            callback(err, null); // Pass the error back to the callback
            return;
        } 

        const roundedTemp = temp.toFixed(1);
        const tempLogMessage = `[GPIO] Temperature read: ${roundedTemp}°C`;
        console.log(tempLogMessage);
        callback(null, roundedTemp); // No error, pass the temperature value back to the callback
    });
}

// You can export these functions to use them elsewhere in your application
export { checkForCanOrCup, readTemperature };
