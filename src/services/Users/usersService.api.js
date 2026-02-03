// import axios from "axios";
import Avatar from "~/assets/Users/Avatar.jpg";
import Avatar1 from "~/assets/Users/Avatar1.jpg";
import Avatar2 from "~/assets/Users/Avatar2.jpg";
export async function getUsers() {
  // const response = await axios.get("url");
  // return response.data;

  return [
    {
      id: 1,
      name: "Camila Alves",
      avatarUrl: Avatar,
      email: "camila.alves@unesp.com.br",
      profile: "Administrador",
      laboratories: [
        { id: 10, name: "Laboratório Central" },
        { id: 11, name: "Laboratório Minas" },
      ],
      status: { id: 1, name: "Ativo", color: "#24b92b" },
      lastAccess: "2025-01-15",
    },
    {
      id: 2,
      name: "Thais Morais",
      avatarUrl: Avatar1,
      email: "thais.morais@unesp.com.br",
      profile: "Coordenador",
      laboratories: [{ id: 12, name: "Laboratório Norte" }],
      status: { id: 2, name: "Inativo", color: "#fd2a2a" },
      lastAccess: "2025-02-10",
    },
    {
      id: 3,
      name: "Ana Antunes",
      avatarUrl: Avatar2,
      email: "ana.antunes@unesp.com.br",
      profile: "Técnico",
      laboratories: [
        { id: 11, name: "Laboratório Minas" },
        { id: 13, name: "Laboratório Centro-Oeste" },
      ],
      status: { id: 1, name: "Ativo", color: "#24b92b" },
      lastAccess: "2025-03-05",
    },
  ];
}

export async function getUserStatus() {
  // const response = await axios.get("url");
  // return response.data;
  return [
    { id: 1, name: "Ativo" },
    { id: 2, name: "Inativo" },
  ];
}
