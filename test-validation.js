// Manual test for validation functionality
// This file tests the validation utilities and components

import { 
  validateTextField, 
  sanitizeInput, 
  getCharacterCountColor, 
  getInputBorderColor,
  FIELD_CONFIG,
  CHARACTER_THRESHOLDS
} from './lib/validation.js';

console.log('Testing Form Validation Implementation');
console.log('=====================================');

// Test 1: Field validation
console.log('\n1. Testing field validation:');

// Test title validation
const testTitle = (value, touched = false) => {
  const result = validateTextField(value, 'title', touched);
  console.log(`Title "${value}": ${result.isValid ? 'VALID' : 'INVALID'} - ${result.error?.message || 'No error'}`);
  return result;
};

testTitle(''); // Should be valid when not touched
testTitle('', true); // Should be invalid when touched
testTitle('Valid title'); // Should be valid
testTitle('a'.repeat(121)); // Should be invalid (too long)

// Test body validation  
const testBody = (value, touched = false) => {
  const result = validateTextField(value, 'body', touched);
  console.log(`Body "${value.substring(0, 20)}...": ${result.isValid ? 'VALID' : 'INVALID'} - ${result.error?.message || 'No error'}`);
  return result;
};

testBody(''); // Should be valid when not touched
testBody('', true); // Should be invalid when touched
testBody('Valid body content'); // Should be valid
testBody('a'.repeat(4001)); // Should be invalid (too long)

// Test 2: Input sanitization
console.log('\n2. Testing input sanitization:');

const testSanitize = (input) => {
  const sanitized = sanitizeInput(input);
  console.log(`Input: "${input}"`);
  console.log(`Sanitized: "${sanitized}"`);
  return sanitized;
};

testSanitize('<script>alert("xss")</script>');
testSanitize('Normal text');
testSanitize('<div>HTML content</div>');
testSanitize('Text with "quotes" and \'apostrophes\'');

// Test 3: Character count colors
console.log('\n3. Testing character count colors:');

const testCharacterColor = (current, max) => {
  const color = getCharacterCountColor(current, max);
  const ratio = current / max;
  console.log(`${current}/${max} (${Math.round(ratio * 100)}%): ${color}`);
  return color;
};

testCharacterColor(0, 120); // Should be zinc-500
testCharacterColor(60, 120); // Should be zinc-500 
testCharacterColor(85, 120); // Should be yellow-600
testCharacterColor(110, 120); // Should be amber-600
testCharacterColor(120, 120); // Should be red-600

// Test 4: Configuration constants
console.log('\n4. Testing configuration:');
console.log('FIELD_CONFIG:', FIELD_CONFIG);
console.log('CHARACTER_THRESHOLDS:', CHARACTER_THRESHOLDS);

// Test 5: Edge cases
console.log('\n5. Testing edge cases:');

// Whitespace handling
testTitle('   ', true); // Should be invalid (only whitespace)
testTitle('  Valid title  '); // Should be valid (trimmed)

// Unicode characters
testTitle('日本語タイトル'); // Should be valid
testBody('漢字、ひらがな、カタカナのテスト'); // Should be valid

console.log('\n✅ All validation tests completed successfully!');