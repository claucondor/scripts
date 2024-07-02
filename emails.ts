const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp();

const db = admin.firestore();

async function main() {
  const data = JSON.parse(fs.readFileSync('bquxjob_10e71d31_18ee9186c2a.json', 'utf8'));

  // Crea un stream de escritura para el archivo .csv
  const writeStream = fs.createWriteStream('output.csv');

  // Escribe los encabezados del archivo .csv
  writeStream.write('profileId,email\n');

  // Itera sobre cada objeto en los datos
  for (const item of data) {
    // Obtiene el documento de Firestore que coincide con el profile_id
    const snapshot = await db.collection('profiles').where('lens.profileId', '==', item.profile_id).get();

    if (!snapshot.empty) {
        snapshot.forEach((doc: any) => {
          const email = doc.data().email;
          console.log('Email:', email);
      
          // Escribe los datos en el archivo .csv
          writeStream.write(`${item.profile_id},${email}\n`);
        });
      } else {
        console.log('No such document!');
      }
  }

  // Cierra el stream de escritura
  writeStream.end();
}

main().catch(console.error);