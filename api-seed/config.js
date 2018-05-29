const apiUrl = process.env.API_URL || 'http://localhost:3000/api/';
const apiUser = process.env.API_USER || 'admin1';
const apiPassword = process.env.API_PASSWORD || 'admin1';
const importFiles = process.env.IMPORT_FILES || 'hoxInstruments';

module.exports = {
  'apiUrl': apiUrl,
  'apiUser': apiUser,
  'apiPassword': apiPassword,
  'importFiles': importFiles.split(',')
};
