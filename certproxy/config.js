const domain = process.env.LE_DOMAIN || 'selfsigned';
const email = process.env.LE_EMAIL;
const environment = process.env.LE_ENVIRONMENT || 'staging';
const certbotPort = process.env.CB_PORT || 8080;

module.exports = {
  'domain': domain,
  'email': email,
  'environment': environment,
  'certbotPort': certbotPort
};
