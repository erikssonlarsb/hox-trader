/**
 * Utils for verifying and creating self-signed ssl certificates.
 *
 * Validity is set to 730 days (2 years). If a certificate already exists,
 * this will be used, unless expiring within 6 months. Then a new will be genreated.
 */
const fs = require('fs');
const pem = require('pem');

module.exports = {
  verify: function(cb) {
    /*  Check if certificate is exists, is valid and expiy is not imminent (within 6 months).
        Return true if so, otherwise return false.
    */

   fs.readFile('/etc/ssl/selfsigned/fullchain.pem', function(err, data) {
     if(err) {
       cb(err, false);
     } else {
       pem.readCertificateInfo(data, function(err, info) {
         if(err) {
           cb(err, false);
         } else {
           console.log(info);

           // Return false if certificate expires withing 3 months.
           let renewDate = new Date();
           renewDate.setMonth(renewDate.getMonth() + 3);
           if (info.validity.end < renewDate.getTime()) {
             console.log("Existing certificate expires within 3 months.");
             cb(null, false);
           } else {
             console.log("Existing certificate valid longer than 3 months.");
             cb(null, true);
           }
         }
       });
     }
   });
  },

  create: function(cb) {
    /*  Create new self-signed certificate.
    */
    pem.createCertificate({
      keyBitsize: 2048,
      country: 'SE',
      state: 'Stockholm',
      organization: 'selfsigned',
      commonName: 'selfsigned',
      altNames: ['selfsigned'],
      selfSigned: true,
      days: 730
    }, function(err, keys) {
      if (err) {
        cb(err);
      } else {
        if (!fs.existsSync('/etc/ssl/selfsigned/')){
            fs.mkdirSync('/etc/ssl/selfsigned/');
        }
        fs.writeFile('/etc/ssl/selfsigned/fullchain.pem', keys.certificate, (err) => {
          if(err) {
            cb(err);
          } else {
            fs.writeFile('/etc/ssl/selfsigned/privkey.pem', keys.serviceKey, (err) => {
              if(err) {
                cb(err);
              } else {
                cb(null, keys);
              }
            });
          }
        });
      }
    });
  }
}
