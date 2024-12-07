const fs = require('fs');
const axios = require('axios');
const core = require('@actions/core');

// Obtén los inputs
const frasePositiva = core.getInput('frase_positiva');
const fraseNegativa = core.getInput('frase_negativa');
const resultatTests = core.getInput('resultat_tests');

// Determina el texto del meme
let textoMeme = '';
if (resultatTests === 'success') {
  textoMeme = frasePositiva;
} else if (resultatTests === 'failure') {
  textoMeme = fraseNegativa;
} else {
  core.setFailed('El valor de resultat_tests no es válido.');
  return;
}

// Función para generar el meme
async function generarMeme() {
  try {
    // Codificación de la URL para evitar errores
    const textoCodificado = encodeURIComponent(textoMeme);
    console.log(`Texto codificado: ${textoCodificado}`);

    // Petición para crear el meme usando la API de Memegen
    const response = await axios.get(`https://api.memegen.link/images/custom/_/${textoCodificado}.png`);

    // Revisa si la creación del meme fue exitosa
    if (response.status === 200) {
      const memeUrl = response.config.url;
      console.log('Meme generado con éxito:', memeUrl);

      // Modificar el README.md
      const readmePath = './README.md';
      fs.readFile(readmePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error al leer el archivo README.md:', err);
          core.setFailed('Error al leer el archivo README.md');
          return;
        }

        // Busca los comentarios delimitadores en el README.md
        const inicioComentario = '<!-- MEME_INICIO -->';
        const finComentario = '<!-- MEME_FIN -->';
        const posicionInicio = data.indexOf(inicioComentario);
        const posicionFin = data.indexOf(finComentario);

        if (posicionInicio === -1 || posicionFin === -1) {
          core.setFailed('No se encontraron los comentarios delimitadores en el README.md.');
          return;
        }

        // Inserta el meme en el lugar adecuado
        const nuevaContenido = data.slice(0, posicionInicio + inicioComentario.length) + `\n![Meme de resultados de tests](${memeUrl})\n` + data.slice(posicionFin);

        // Escribir los cambios en README.md
        fs.writeFile(readmePath, nuevaContenido, 'utf8', (err) => {
          if (err) {
            console.error('Error al modificar el archivo README.md:', err);
            core.setFailed('Error al modificar el archivo README.md');
            return;
          }

          console.log('Meme añadido al README.md');
        });
      });
    } else {
      core.setFailed('Error al generar el meme.');
    }
  } catch (error) {
    core.setFailed('Error al generar el meme: ' + error.message);
  }
}

generarMeme();
