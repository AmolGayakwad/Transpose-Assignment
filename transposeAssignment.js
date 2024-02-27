const fs = require('fs');
const csv = require('csv-parser');

let patient_info = {};

// Read CSV one row at a time
fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', (row) => {
    let patientID = row['Patient'];
    let fields = row['Fields'];

    let key = `${patientID}_${fields}`;

    patient_info[key] = row['Value']; 
  })
  .on('end', () => {
    let fieldsSet = new Set();
    let uniquePatientIDs = new Set();

    for (let key in patient_info) {
    let [patientID, field] = key.split('_');
    fieldsSet.add(field);
    uniquePatientIDs.add(patientID);
    }
    let headerRow = ['Patient', ...Array.from(fieldsSet)];

    fs.writeFileSync('output.csv', headerRow.join(',') + '\n');

    for (let patientId of uniquePatientIDs) {
      let dataRow = [patientId];
      console.log(dataRow)
      for (let field of fieldsSet) {
        let key = `${patientId}_${field}`;
        console.log(key)
        dataRow.push(patient_info[key] || ''); 
        console.log(dataRow)
      }
  
      fs.appendFileSync('output.csv', dataRow.join(',') + '\n');
    }
  });
