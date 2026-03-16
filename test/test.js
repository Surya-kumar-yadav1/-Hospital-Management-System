// Test Script - Run in browser console to verify
// Place this in a test file or run manually

async function testFullFlow() {
  console.log("🧪 Testing Hospital Management System Flow\n");

  // Test 1: Check if backend is running
  try {
    const backendTest = await fetch('http://localhost:3001/api/doctors');
    console.log("✅ Backend server is running");
  } catch (e) {
    console.log("❌ Backend server is NOT running - Start it with: node index.js");
    return;
  }

  // Test 2: Check if database is connected
  try {
    const doctors = await fetch('http://localhost:3001/api/doctors').then(r => r.json());
    console.log(`✅ Database connected - Found ${doctors.length} doctors`);
  } catch (e) {
    console.log("❌ Database NOT connected");
    return;
  }

  // Test 3: Simulate patient registration
  console.log("\n📝 Testing Patient Registration:");
  try {
    const registerRes = await fetch('http://localhost:3001/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Test',
        last_name: 'User',
        date_of_birth: '1990-01-15',
        gender: 'Male',
        contact_number: '9876543210',
        email: 'test@example.com',
        address: '123 Test Street'
      })
    });
    
    const registerData = await registerRes.json();
    if (registerData.patient_id) {
      console.log(`✅ Patient registered with ID: ${registerData.patient_id}`);
      const testPatientId = registerData.patient_id;

      // Test 4: Access dashboard with new patient ID
      console.log(`\n📊 Testing Dashboard Access with Patient ID: ${testPatientId}`);
      
      const profileRes = await fetch(`http://localhost:3001/api/patients/${testPatientId}`);
      const appointmentsRes = await fetch(`http://localhost:3001/api/patients/${testPatientId}/appointments`);
      
      if (profileRes.ok && appointmentsRes.ok) {
        const profile = await profileRes.json();
        const appointments = await appointmentsRes.json();
        
        console.log(`✅ Dashboard data loaded successfully`);
        console.log(`   - Patient: ${profile.first_name} ${profile.last_name}`);
        console.log(`   - Appointments: ${appointments.length}`);
        console.log(`\n🎉 Everything is connected and working!`);
      }
    }
  } catch (e) {
    console.log("❌ Error:", e.message);
  }
}

testFullFlow();
