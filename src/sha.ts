import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';

async function sha512(input: string) {
  const inputAbsolutePath = path.resolve(input);

  console.log('start to calculate sha512 for "%s"', inputAbsolutePath);
  if (!fs.existsSync(inputAbsolutePath)) {
    const error = new Error(`file "${inputAbsolutePath}" is not exists`);

    console.warn('file "%s" is not exists', inputAbsolutePath);

    throw error;
  }

  const inputStream = fs.createReadStream(inputAbsolutePath);
  const fsHash = crypto.createHash('sha512');

  return new Promise((resolve, reject) => {

    inputStream.on('data', function (d) {
        fsHash.update(d);
    });

    inputStream.on('end', function () {
        const md5 = fsHash.digest('base64');
        resolve(md5);
    });
  });
}

export default sha512;
