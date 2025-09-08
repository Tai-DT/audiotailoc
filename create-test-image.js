const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a canvas
const width = 100;
const height = 100;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

// Fill with blue
context.fillStyle = '#3498db';
context.fillRect(0, 0, width, height);

// Add some text
context.fillStyle = '#ffffff';
context.font = '12px Arial';
context.textAlign = 'center';
context.textBaseline = 'middle';
context.fillText('MCP Test', width/2, height/2);

// Save to file
const out = fs.createWriteStream('test-upload.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('Test image created: test-upload.png'));
