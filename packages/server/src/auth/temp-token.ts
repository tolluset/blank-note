import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Generate temporary token for user-1
const tempToken = jwt.sign(
  { userId: 'user-1' },
  JWT_SECRET,
  { expiresIn: '7d' }
)

console.log('Temporary token for user-1:')
console.log(tempToken)
console.log('\nUse this in your requests:')
console.log(`Authorization: Bearer ${tempToken}`)