/**
 * cert-gen geneates an SSL certificate for the reverse proxy.
 *
 * Validity is set to 730 days (2 years). If a certificate already exists,
 * this will be used, unless expiring within 6 months. Then a new will be genreated.
 */
const fs = require('fs');
const pem = require('pem');
const config = require('./config');

fs.readdir('/certs/', (err, files) => {
  if (err) {
    console.error(err);
  } else {
    let existingCertificate = false;

    files.forEach(file => {
      if(file == config.keyName + '.crt') {
        existingCertificate = true;

        console.log("Verifying existing certificate.");
        pem.readCertificateInfo(fs.readFileSync('/certs/' + config.keyName + '.crt'), (err, info) => {
          if (err) {
            console.log(err);
          } else {

            console.log(info);

            // renew certificate if it expires withing 6 months
            let renewDate = new Date();
            renewDate.setMonth(renewDate.getMonth() + 6);
            if (info.validity.end < renewDate.getTime()) {
              console.log("Existing certificate expires within 6 months. Creating new.");
              createCertificate();
            } else {
              console.log("Existing certificate valid longer than 6 months. Using existing.")
            }
          }
        })
      }
    });

    if (!existingCertificate) {
      console.log("No certificate found. Creating new.");
      createCertificate();
    }
  }
});

function createCertificate() {
  pem.createCertificate({
    keyBitsize: 4096,
    country: 'SE',
    state: 'Stockholm',
    organization: config.commonName,
    commonName: config.commonName,
    altNames: [config.commonName],
    selfSigned: true,
    days: 730
  }, (err, keys) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile('/certs/' + config.keyName + '.crt', keys.certificate, (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log("Wrote certificate file.");
        }
      });
      fs.writeFile('/certs/' + config.keyName + '.key', keys.serviceKey, (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log("wrote key file.");
        }
      });
    }
  });
}
