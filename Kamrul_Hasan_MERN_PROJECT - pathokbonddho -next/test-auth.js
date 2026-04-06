const db = require('./db/database');
const User = require('./models/user-model');
const bcrypt = require('bcryptjs');

async function testAuth() {
    try {
        console.log("--- Starting Auth Diagnostic ---");
        
        // 1. Test database connection
        await db.authenticate();
        console.log("✅ Database connection authenticated successfully.");

        // 2. Test fetching all users
        const users = await User.findAll();
        console.log(`✅ Found ${users.length} users in the database.`);
        
        if (users.length === 0) {
            console.log("⚠️ No users found! Please register a user first.");
        } else {
            // 3. Test a specific user
            const testUser = users[0];
            console.log(`✅ Testing first user: ${testUser.email} (ID: ${testUser.id})`);
            console.log(`   - isAdmin: ${testUser.isAdmin}`);
            console.log(`   - role: ${testUser.role}`);

            // 4. Test comparePassword if possible
            // Note: We don't have the original password, but we can test if the function exists
            if (typeof testUser.comparePassword === 'function') {
                console.log("✅ comparePassword method exists on User instance.");
            } else {
                console.error("❌ comparePassword method MISSING from User instance!");
            }

            // 5. Test generateToken
            try {
                const token = testUser.generateToken();
                console.log("✅ generateToken generated a token successfully.");
                // console.log("Token sample:", token.substring(0, 20) + "...");
            } catch (jwtError) {
                console.error("❌ generateToken FAILED:", jwtError.message);
                if (!process.env.JWT_SECRET_KEY) {
                    console.error("   Reason: JWT_SECRET_KEY is MISSING in process.env!");
                }
            }
        }

    } catch (error) {
        console.error("❌ Diagnostic FAILED with error:");
        console.error(error);
    } finally {
        await db.close();
        console.log("--- Diagnostic Complete ---");
    }
}

testAuth();
