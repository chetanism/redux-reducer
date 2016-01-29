/**
 * Babel Starter Kit | https://github.com/kriasoft/babel-starter-kit
 * Copyright (c) Konstantin Tarkus <hello@tarkus.me> | The MIT License
 */

import del from 'del';
import fs from './lib/fs';

// Clean output directories
const cleanup = async () => {
  await del(['lib/*'], { dot: true });
  await fs.makeDir('lib');
};

// Compile the source code into a distributable format
const src = async () => {
  const babel = require('babel');
  const files = await fs.getFiles('src');

  for (const file of files) {
    const source = await fs.readFile('src/' + file);
    const result = babel.transform(source, { stage: 0 });
    await fs.writeFile('lib/' + file, result.code);
    await fs.writeFile('lib/' + file.substr(0, file.length - 3) + '.babel.js', source);
  }
};

// Run all build steps in sequence
export default async () => {
  try {
    console.log('clean');
    await cleanup();
    console.log('compile src');
    await src();
  } catch (err) {
    console.error(err.stack);
  }
};
