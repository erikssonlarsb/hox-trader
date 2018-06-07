const url = process.env.API_URL || 'http://localhost:3000/api/';
const username = process.env.API_USERNAME || 'admin1';
const password = process.env.API_PASSWORD || 'admin1';
const importFiles = process.env.IMPORT_FILES || 'wc2018Instruments';
const gitCommit = process.env.GIT_COMMIT || 'dev';
const inviteOnly = process.env.INVITE_ONLY || false;

module.exports = {
  'url': url,
  'username': username,
  'password': password,
  'importFiles': importFiles.split(','),
  'gitCommit': gitCommit,
  'inviteOnly': inviteOnly
};
