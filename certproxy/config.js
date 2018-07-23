const domain = process.env.DOMAIN || 'selfsigned';
const email = process.env.EMAIL;
const certbotPort = process.env.CB_PORT || 8080;

module.exports = {
  'domain': domain,
  'email': email,
  'certbotPort': certbotPort
};
