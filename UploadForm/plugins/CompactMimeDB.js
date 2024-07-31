const mimeDB = require('mime-db');
const fs = require('fs');

class CompactMimeDB {
  constructor({ filename }) {
    this.filename = filename;
    this.textEncoder = new TextEncoder();
  }

  apply(compiler) {
    compiler.hooks.environment.tap('CompactMimeDB', compilation => {
      const result = Object.entries(mimeDB).reduce(
        (acc, [mime, description]) =>
          mime.startsWith('image/') && description.extensions
            ? {
                ...acc,
                [mime.replace('image/', '')]: description.extensions,
              }
            : acc,
        {},
      );
      const json = JSON.stringify(result);
      fs.writeFileSync(this.filename, json);
      console.log(`[CompactMimeDB]: FILE CREATED (${this.textEncoder.encode(json).length} BYTES)`);
    });
  }
}

module.exports = CompactMimeDB;
