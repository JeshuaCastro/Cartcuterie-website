// Test script to verify OpenAI API key
// Run with: node test-openai.mjs

import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ OPENAI_API_KEY not found in environment variables');
  console.log('Make sure to set it: export OPENAI_API_KEY=your_key_here');
  process.exit(1);
}

console.log('✓ API Key found:', apiKey.substring(0, 20) + '...');

const openai = new OpenAI({ apiKey });

console.log('\n🔍 Testing OpenAI API connection...\n');

try {
  // Test with a simple completion
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Say 'API key is valid!'" }],
    max_tokens: 10,
  });

  console.log('✅ SUCCESS! API key is valid.');
  console.log('Response:', completion.choices[0].message.content);
  console.log('\n✓ You can now use the AI cart generation feature!');
} catch (error) {
  console.error('❌ ERROR:', error.message);
  
  if (error.status === 401) {
    console.log('\n⚠️  Authentication failed. Your API key is invalid or expired.');
    console.log('Please:');
    console.log('1. Go to https://platform.openai.com/api-keys');
    console.log('2. Create a new API key');
    console.log('3. Update your .env.local file');
    console.log('4. Restart your development server');
  } else if (error.status === 429) {
    console.log('\n⚠️  Rate limit exceeded. Please wait a moment and try again.');
  } else if (error.status === 403) {
    console.log('\n⚠️  Your API key doesn\'t have permission for this operation.');
    console.log('Make sure billing is enabled: https://platform.openai.com/account/billing');
  }
}
