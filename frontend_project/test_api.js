async function test() {
  const req = await fetch('http://192.168.1.3:9091/auth/register', {
    method: 'POST',
    body: JSON.stringify({username: "tejal_" + Date.now(), password: "user123", role: "ROLE_ADMIN"}),
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('Reg code:', req.status);
  
  const res = await fetch('http://192.168.1.3:9091/auth/login', {
    method: 'POST',
    body: 'username=tejal&password=user123',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const text = await res.text();
  console.log('Login res:', text.substring(0, 50) + '...');

  if(text.includes('.')) {
      try {
        const payload = JSON.parse(Buffer.from(text.split('.')[1], 'base64').toString('ascii'));
        console.log('Payload:', payload);
      } catch { console.log('Decode error'); }
  }
}
test();
