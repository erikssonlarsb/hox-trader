/**
 * Utils for verifying and creating Let's encrypt certificates.
 */
const { exec } = require('child_process');

module.exports = {
  create: function(environment, port, email, domain, cb) {
    /*  Create Let's Encrypt certificate.
    */
    const staging = (environment == 'prod') ? '' : '--staging';

    const cmd = `/usr/bin/certbot certonly \
                  --standalone \
                  --non-interactive \
                  --agree-tos \
                  ${staging} \
                  --config-dir /etc/ssl/letsencrypt \
                  --http-01-port ${port} \
                  --email ${email} \
                  --domains ${domain}`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        cb(err)
        return;
      } else {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        cb(null);
      }
    });
  }
}
