const fs = require('fs');
const csv = require('csv-parser');

// Step 1: Create an empty dictionary called 'patient_info'
let patient_info = {};

// Step 2: Read CSV one row at a time
fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Step 2a: Extract 'Patient' ID and 'Fields' value
    let patientID = row['Patient'];
    let fields = row['Fields'];


    // Step 2b: Create a key by concatenating 'Patient' ID with 'Fields' value
    let key = `${patientID}_${fields}`;

    // Step 2c: Add key-value pair to 'patient_info' dictionary
    patient_info[key] = row['Value']; 
  })
  .on('end', () => {
    // Step 3: Generate header row
    let fieldsSet = new Set();
    let uniquePatientIDs = new Set();

    for (let key in patient_info) {
    let [patientID, field] = key.split('_');
    fieldsSet.add(field);
    uniquePatientIDs.add(patientID);
    }
    let headerRow = ['Patient', ...Array.from(fieldsSet)];

    // Step 4: Write header row to output file
    fs.writeFileSync('output.csv', headerRow.join(',') + '\n');

    for (let patientId of uniquePatientIDs) {
      let dataRow = [patientId];
      console.log(dataRow)
      for (let field of fieldsSet) {
        let key = `${patientId}_${field}`;
        console.log(key)
        dataRow.push(patient_info[key] || ''); // If the value is missing, default to an empty string
        console.log(dataRow)
      }
  
      fs.appendFileSync('output.csv', dataRow.join(',') + '\n');
    }
  });
