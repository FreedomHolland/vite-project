const Gpio = require('onoff').Gpio;

// Setup GPIO pins for the switches
const detectionCup = new Gpio(17, 'in', 'both'); // GPIO pin 17 for Detection Cup
const canSelector = new Gpio(27, 'in', 'both'); // GPIO pin 27 for Can Selector

// Function to check sensor values
const checkSensors = () => {
    const detectionCupValue = detectionCup.readSync();
    const canSelectorValue = canSelector.readSync();

    if (detectionCupValue === 1) {
        console.log("Cup is placed (High Voltage Detected)");
    } else {
        console.log("Place the cup (Low Voltage Detected)");
    }

    if (canSelectorValue === 1 && detectionCupValue === 1) {
        console.log("Can is placed (High Voltage Detected in both)");
    }
};

// Set an interval to check sensors every second (1000 milliseconds)
setInterval(checkSensors, 1000); // Adjust the interval time as needed

console.log("Script is running and checking sensors every second...");

// Cleanup GPIO on exit
process.on('SIGINT', () => {
    detectionCup.unexport();
    canSelector.unexport();
    console.log('Cleanup GPIO and exiting...');
    process.exit();
});
