console.log('Testing API endpoints manually...');
console.log('Please open these URLs in your browser:');
console.log('');
console.log('✅ Health Check: http://localhost:3002/api/health');
console.log('📊 Database Test: http://localhost:3002/api/users');
console.log('👨‍🏫 Faculty List: http://localhost:3002/api/faculty');
console.log('📚 Programs List: http://localhost:3002/api/programs');
console.log('🏫 Classrooms List: http://localhost:3002/api/classrooms');
console.log('👨‍🎓 Students List: http://localhost:3002/api/students');
console.log('');
console.log('For POST testing, you can use tools like Postman or curl.');
console.log('');

// Let's try to make a simple HTTP request using Node.js built-in modules
const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          path: path
        });
      });
    });

    req.on('error', (err) => {
      reject({ path, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({ path, error: 'Request timeout' });
    });

    req.end();
  });
}

async function runQuickTest() {
  try {
    console.log('Testing health endpoint...');
    const result = await testEndpoint('/api/health');
    console.log(`✅ ${result.path} - Status: ${result.status}`);
    console.log(`Response: ${result.data}`);
  } catch (error) {
    console.log(`❌ ${error.path} - Error: ${error.error}`);
  }
}

runQuickTest();