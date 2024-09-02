import { sensors, temperature } from 'ds18b20';

sensors((err, ids) => {
    if (err) {
        console.error('Error detecting sensor:', err);
        return;
    }

    // Assuming only one sensor, otherwise loop through `ids`
    const deviceId = ids[0];

    // Function to read and print the temperature
    const readTemperature = () => {
        temperature(deviceId, (err, temp) => {
            if (err) {
                //console.error('Error reading temperature:', err);
                console.error('shit');
                return;
            }

            console.log('Current temperature is: ' + temp.toFixed(1) + '°C');
        });
    };

    // Read temperature every second
    setInterval(readTemperature, 1000);
});
