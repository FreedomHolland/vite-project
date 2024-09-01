import { Gpio } from 'pigpio';

// GPIO Pin Setup
const Can_Sensor = new Gpio(18, { mode: Gpio.INPUT }); // GPIO 18 (physical pin 12)
const Cup_Sensor = new Gpio(17, { mode: Gpio.INPUT }); // GPIO 17 (physical pin 11)

let previousCanSensorValue = Can_Sensor.digitalRead();
let previousCupSensorValue = Cup_Sensor.digitalRead();

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

export { checkForCanOrCup };
