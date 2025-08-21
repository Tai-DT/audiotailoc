import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyC0MdgM40z_WUtT75DXtsQLCiAuo1TfOwk';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function testGemini() {
  try {
    const prompt = 'Xin chào, bạn có thể trả lời bằng tiếng Việt không?';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('Gemini Response:', response.text());
  } catch (error) {
    console.error('Gemini Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', await error.response.text());
    }
  }
}

testGemini();
