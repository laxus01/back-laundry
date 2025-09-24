// Script para generar JWT_SECRET seguro para producción
const crypto = require('crypto');

function generateSecureJWTSecret() {
  // Generar 64 bytes aleatorios y convertir a base64
  const secret = crypto.randomBytes(64).toString('base64');
  
  console.log('🔐 JWT_SECRET seguro para producción:');
  console.log('=====================================');
  console.log(secret);
  console.log('=====================================');
  console.log('📋 Copia este valor y úsalo en Railway');
  console.log('⚠️  NUNCA lo compartas públicamente');
  
  return secret;
}

// Generar múltiples opciones
console.log('🎲 Generando 3 opciones de JWT_SECRET:\n');

for (let i = 1; i <= 3; i++) {
  console.log(`Opción ${i}:`);
  generateSecureJWTSecret();
  console.log('\n');
}

console.log('💡 Elige cualquiera de las opciones de arriba para Railway');
console.log('🗑️  Puedes eliminar este archivo después de usar el secret');
