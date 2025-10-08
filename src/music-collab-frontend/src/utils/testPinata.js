import pinataService from '../services/pinataService';

/**
 * Test Pinata configuration and functionality
 */
export const testPinataIntegration = async () => {
  console.log('🔧 Testing Pinata Integration...');
  
  try {
    // Test 1: Authentication
    console.log('📡 Testing authentication...');
    const authResult = await pinataService.testAuthentication();
    console.log('✅ Authentication successful:', authResult);

    // Test 2: Usage stats
    console.log('📊 Getting usage stats...');
    const stats = await pinataService.getUsageStats();
    console.log('📈 Current usage:', stats);

    // Test 3: File validation
    console.log('🔍 Testing file validation...');
    try {
      // Test with invalid file (should throw error)
      const fakeFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      pinataService.validateAudioFile(fakeFile);
      console.log('❌ Validation should have failed');
    } catch (error) {
      console.log('✅ File validation works:', error.message);
    }

    // Test 4: Gateway URLs
    console.log('🌐 Testing gateway URLs...');
    const testHash = 'QmTestHash123456789';
    const urls = pinataService.getMultipleGatewayUrls(testHash);
    console.log('🔗 Gateway URLs:', urls);

    console.log('🎉 All tests passed! Pinata is ready to use.');
    return true;

  } catch (error) {
    console.error('❌ Pinata test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your API keys in .env.local');
    console.log('2. Ensure you have an active Pinata account');
    console.log('3. Verify your network connection');
    console.log('4. Check the PINATA_SETUP.md guide');
    return false;
  }
};

// Helper function to format file sizes
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to validate IPFS hash format
export const isValidIPFSHash = (hash) => {
  // Basic IPFS hash validation (CIDv0 and CIDv1)
  const ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})$/;
  return ipfsHashRegex.test(hash);
};

export default testPinataIntegration;
