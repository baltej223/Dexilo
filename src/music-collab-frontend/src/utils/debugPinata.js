import pinataService from '../services/pinataService';

// Test Pinata connection in browser console
window.testPinata = async () => {
  console.log('🔧 Testing Pinata connection...');
  
  try {
    // Test authentication
    const auth = await pinataService.testAuthentication();
    console.log('✅ Authentication successful:', auth);
    
    // Test usage stats
    const stats = await pinataService.getUsageStats();
    console.log('📊 Usage stats:', stats);
    
    return true;
  } catch (error) {
    console.error('❌ Pinata test failed:', error);
    
    // Check specific error types
    if (error.message.includes('Network Error')) {
      console.log('🔍 Network Error Troubleshooting:');
      console.log('1. Check internet connection');
      console.log('2. Verify Pinata is not blocked by firewall/proxy');
      console.log('3. Try accessing https://api.pinata.cloud directly');
    }
    
    if (error.response?.status === 401) {
      console.log('🔍 Authentication Error:');
      console.log('1. Check API keys in .env.local');
      console.log('2. Verify keys have correct permissions');
      console.log('3. Make sure keys are not expired');
    }
    
    return false;
  }
};

console.log('💡 Run window.testPinata() in console to test Pinata connection');
