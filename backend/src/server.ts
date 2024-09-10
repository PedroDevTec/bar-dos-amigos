import app from './app';
import { PrismaClient } from '@prisma/client';
import { initializeAdminUser } from './services/userService';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Inicializa o usuário admin em memória na inicialização
  await initializeAdminUser();
});
