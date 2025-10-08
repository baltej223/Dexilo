// Quick test for Pinata connectivity from browser
async function testPinataConnection() {
  const API_KEY = 'b49dea9ed88bf6e5387b';
  const SECRET_KEY = '7d200add512fa6bb8195f67430485ee6c96bab07d5080dd9d4a89398d857e6a2';
  
  console.log('🔧 Testing Pinata connection...');
  
  // Test 1: Direct fetch to test authentication
  try {
    console.log('📡 Testing authentication endpoint...');
    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'pinata_api_key': API_KEY,
        'pinata_secret_api_key': SECRET_KEY,
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authentication successful:', data);
    } else {
      console.error('❌ Authentication failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error during authentication test:', error);
    
    if (error.message.includes('CORS')) {
      console.log('🔧 CORS issue detected. This is common in browser environments.');
    }
  }

  // Test 2: Try with CORS proxy
  try {
    console.log('🔄 Testing with CORS proxy...');
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://api.pinata.cloud/data/testAuthentication';
    
    const response = await fetch(proxyUrl + targetUrl, {
      method: 'GET',
      headers: {
        'pinata_api_key': API_KEY,
        'pinata_secret_api_key': SECRET_KEY,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CORS proxy test successful:', data);
    } else {
      console.error('❌ CORS proxy test failed:', response.status);
    }
  } catch (error) {
    console.error('❌ CORS proxy test failed:', error);
  }

  // Test 3: Check usage stats
  try {
    console.log('📊 Getting usage stats...');
    const response = await fetch('https://api.pinata.cloud/data/userPinnedDataTotal', {
      method: 'GET',
      headers: {
        'pinata_api_key': API_KEY,
        'pinata_secret_api_key': SECRET_KEY,
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('📈 Usage stats:', data);
    } else {
      console.error('❌ Usage stats failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Usage stats error:', error);
  }
}

// Run the test
testPinataConnection();

export default testPinataConnection;
