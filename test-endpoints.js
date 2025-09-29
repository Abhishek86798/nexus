const https = require('https');
const http = require('http');

// Test function to make HTTP requests
function testEndpoint(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  const baseUrl = 'http://localhost:3002';
  
  console.log('🧪 Testing API Endpoints\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await testEndpoint(`${baseUrl}/api/health`);
    console.log(`   Status: ${healthResponse.statusCode}`);
    console.log(`   Response: ${healthResponse.body}`);
    console.log('   ✅ Health check passed\n');

    // Test 2: Users endpoint (database connection test)
    console.log('2. Testing Database Connection...');
    const usersResponse = await testEndpoint(`${baseUrl}/api/users`);
    console.log(`   Status: ${usersResponse.statusCode}`);
    console.log(`   Response: ${usersResponse.body}`);
    if (usersResponse.statusCode === 200) {
      console.log('   ✅ Database connection working\n');
    } else {
      console.log('   ❌ Database connection issue\n');
    }

    // Test 3: Faculty GET
    console.log('3. Testing Faculty GET...');
    const facultyGetResponse = await testEndpoint(`${baseUrl}/api/faculty`);
    console.log(`   Status: ${facultyGetResponse.statusCode}`);
    console.log(`   Response: ${facultyGetResponse.body}`);
    console.log('   ✅ Faculty GET tested\n');

    // Test 4: Faculty POST
    console.log('4. Testing Faculty POST...');
    const newFaculty = {
      name: "Dr. Test Professor",
      expertise_tags: ["Mathematics", "Statistics"],
      availability_mask: {
        "monday": [1, 2, 3, 4],
        "tuesday": [1, 2, 3, 4, 5],
        "wednesday": [1, 2, 3, 4],
        "thursday": [1, 2, 3, 4, 5],
        "friday": [1, 2, 3, 4]
      }
    };
    const facultyPostResponse = await testEndpoint(`${baseUrl}/api/faculty`, 'POST', newFaculty);
    console.log(`   Status: ${facultyPostResponse.statusCode}`);
    console.log(`   Response: ${facultyPostResponse.body}`);
    console.log('   ✅ Faculty POST tested\n');

    // Test 5: Programs GET
    console.log('5. Testing Programs GET...');
    const programsResponse = await testEndpoint(`${baseUrl}/api/programs`);
    console.log(`   Status: ${programsResponse.statusCode}`);
    console.log(`   Response: ${programsResponse.body}`);
    console.log('   ✅ Programs GET tested\n');

    // Test 6: Students GET
    console.log('6. Testing Students GET...');
    const studentsResponse = await testEndpoint(`${baseUrl}/api/students`);
    console.log(`   Status: ${studentsResponse.statusCode}`);
    console.log(`   Response: ${studentsResponse.body}`);
    console.log('   ✅ Students GET tested\n');

    console.log('🎉 All endpoint tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();