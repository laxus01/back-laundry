import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

async function migratePasswords() {
  console.log('🔄 Iniciando migración de contraseñas...');
  
  // Crear aplicación NestJS
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    // Obtener repositorio de usuarios
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    
    // Obtener todos los usuarios
    const users = await userRepository.find();
    console.log(`📊 Encontrados ${users.length} usuarios para migrar`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      // Verificar si la contraseña ya está hasheada (bcrypt hash empieza con $2a$, $2b$, $2x$, $2y$)
      if (user.password.match(/^\$2[abxy]\$\d+\$/)) {
        console.log(`⏭️  Usuario '${user.user}' ya tiene contraseña hasheada, omitiendo...`);
        skippedCount++;
        continue;
      }
      
      // Validar que la contraseña no esté vacía
      if (!user.password || user.password.trim() === '') {
        console.log(`⚠️  Usuario '${user.user}' tiene contraseña vacía, omitiendo...`);
        skippedCount++;
        continue;
      }
      
      try {
        // Crear backup de la contraseña original (solo para logging, no se guarda)
        const originalPassword = user.password;
        
        // Hashear la contraseña con bcrypt (salt rounds: 10)
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Actualizar en la base de datos
        await userRepository.update(user.id, { password: hashedPassword });
        
        console.log(`✅ Usuario '${user.user}' migrado exitosamente`);
        migratedCount++;
        
        // Verificar que el hash funciona correctamente
        const isValid = await bcrypt.compare(originalPassword, hashedPassword);
        if (!isValid) {
          throw new Error(`Verificación de hash falló para usuario '${user.user}'`);
        }
        
      } catch (error) {
        console.error(`❌ Error migrando usuario '${user.user}':`, error.message);
        // Continuar con el siguiente usuario en caso de error
      }
    }
    
    console.log('\n📈 Resumen de migración:');
    console.log(`✅ Usuarios migrados: ${migratedCount}`);
    console.log(`⏭️  Usuarios omitidos: ${skippedCount}`);
    console.log(`📊 Total procesados: ${users.length}`);
    
    if (migratedCount > 0) {
      console.log('\n🎉 ¡Migración completada exitosamente!');
      console.log('⚠️  IMPORTANTE: Asegúrate de actualizar tu código de autenticación para usar bcrypt.compare()');
    } else {
      console.log('\n ℹ️  No se encontraron contraseñas para migrar');
    }
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error);
    process.exit(1);
  } finally {
    // Cerrar la aplicación
    await app.close();
  }
}

// Función de confirmación de seguridad
async function confirmMigration(): Promise<boolean> {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    console.log('\n⚠️  ADVERTENCIA: Esta operación modificará las contraseñas en la base de datos');
    console.log('📋 Asegúrate de tener un backup de la base de datos antes de continuar');
    console.log('🔄 Las contraseñas en texto plano se convertirán a hash bcrypt');
    
    rl.question('\n¿Estás seguro de que quieres continuar? (escriba "SI" para confirmar): ', (answer) => {
      rl.close();
      resolve(answer.trim().toUpperCase() === 'SI');
    });
  });
}

// Ejecutar migración con confirmación
async function main() {
  console.log('🔐 Script de Migración de Contraseñas - Laundry Backend');
  console.log('================================================\n');
  
  const confirmed = await confirmMigration();
  
  if (!confirmed) {
    console.log('❌ Migración cancelada por el usuario');
    process.exit(0);
  }
  
  await migratePasswords();
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

export { migratePasswords };
