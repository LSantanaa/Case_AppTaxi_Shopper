export interface IDataDrivers {
  id: number;
  name: string;
  description: string;
  car: string;
  review: {
    rating: number;
    comment: string;
  };
  rateKM: number;
  minMeters: number;
}

export const dataDrivers: IDataDrivers[] = [
  {
    id: 1,
    name: "Homer Simpson",
    description:
      "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
    car: "Plymouth Valiant 1973 rosa e enferrujado",
    review: {
      rating: 2.0,
      comment:
        "Motorista simpático,mas errou o caminho 3 vezes. O carro cheira a donuts.",
    },
    rateKM: 2.5,
    minMeters: 1000,
  },
  {
    id: 2,
    name: "Dominic Toretto",
    description:
      "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
    car: "Dodge Charger R/T 1970 modificado",
    review: {
      rating: 4.0,
      comment:
        "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
    },
    rateKM: 5.0,
    minMeters: 5000,
  },
  {
    id: 3,
    name: "James Bond",
    description:
      "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto.Aperte o cinto e aproveite a viagem.",
    car: "Aston Martin DB5 clássico",
    review: {
      rating: 5.0,
      comment:
        "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
    },
    rateKM: 10.0,
    minMeters: 10000,
  },
];
