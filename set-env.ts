const { writeFile } = require('fs');
//  Your  environment.custom.ts  file.  Will  be  ignored  by  git.
const targetPath = './src/environments/environment.custom.ts';
//  Load  dotenv  to  work  with  process.env
require('dotenv').config();
//  environment.ts  file  structure
const envConfigFile = `
export  const  environment  =  {
  production:  false,
  firebase: {
    apiKey: '${process.env['FIREBASE_API_KEY']}',
    authDomain: '${process.env['FIREBASE_AUTH_DOMAIN']}',
    projectId: '${process.env['FIREBASE_PROJECT_ID']}',
    storageBucket: '${process.env['FIREBASE_STORAGE_BUCKET']}',
    messagingSenderId: '${process.env['FIREBASE_MESSAGING_SENDER_ID']}',
    appId: '${process.env['FIREBASE_APP_ID']}',
    measurementId: '${process.env['FIREBASE_MEASUREMENT_ID']}'
  }
};
`;
writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    throw console.error(err);
  } else {
    console.log('Using  custom  environment');
  }
});
