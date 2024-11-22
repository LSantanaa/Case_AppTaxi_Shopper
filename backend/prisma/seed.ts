import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.drivers.createMany({
    data: [
      {
        name: "Homer Simpson",
        description: "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio.",
        car: "Plymouth Valiant 1973 rosa e enferrujado",
        assessment: 2.0,
        rateKM: 2.5,
        minKM: 3,
      },
      {
        name: "Dominic Toretto",
        description: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez.",
        car: "Dodge Charger R/T 1970 modificado",
        assessment: 4.0,
        rateKM: 5.0,
        minKM: 5,
      },
      {
        name: "James Bond",
        description: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto.",
        car: "Aston Martin DB5 clássico",
        assessment: 5.0,
        rateKM: 10.0,
        minKM: 10,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
