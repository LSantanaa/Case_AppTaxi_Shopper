import prisma from "../config/prismaClient";

export default async function seedDriversDb() {
  const drivers = await prisma.drivers.findMany();
  if (drivers.length === 0) {
    await prisma.drivers.createMany({
      data: [
        {
          name: "Homer Simpson",
          description:
            "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
          car: "Plymouth Valiant 1973 rosa e enferrujado",
          rateKM: 2.5,
          minKM: 1,
        },
        {
          name: "Dominic Toretto",
          description:
            "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
          car: "Dodge Charger R/T 1970 modificado",
          rateKM: 5.0,
          minKM: 5,
        },
        {
          name: "James Bond",
          description:
            "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto.Aperte o cinto e aproveite a viagem.",
          car: "Aston Martin DB5 clássico",
          rateKM: 10.0,
          minKM: 10,
        },
      ],
    });

    const dataDrivers = await prisma.drivers.findMany();
    const reviews = await prisma.review.findMany();

    if (reviews.length === 0) {
      await prisma.review.createMany({
        data: [
          {
            driver_id: dataDrivers[0].id,
            rating: 2.0,
            comment:
              "Motorista simpático,mas errou o caminho 3 vezes. O carro cheira a donuts.",
          },
          {
            driver_id: dataDrivers[1].id,
            rating: 4.0,
            comment:
              "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
          },
          {
            driver_id: dataDrivers[2].id,
            rating: 5.0,
            comment:
              "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
          },
        ],
      });
    }
    console.log(`Foram inseridos ${dataDrivers.length} registros nas tabela Drivers e Reviews`)
  } else {
    console.log("O banco de dados já contém os dados necessários");
    return;
  }
}
