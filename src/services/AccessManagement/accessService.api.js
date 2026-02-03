// import axios from "axios";

export async function getAccessProfiles() {
  // const response = await axios.get("url");
  // return response.data;

  return [
    {
      id: 1,
      name: "Administrador",
      description: "Acesso total ao sistema",
      creationDate: "2025-01-15",
      status: true,
      permissions: [1, 2, 6],
    },
    {
      id: 2,
      name: "Coordenador",
      description: "Gerencia Laboratórios e usuários",
      creationDate: "2025-02-10",
      status: true,
      permissions: [1, 4],
    },
    {
      id: 3,
      name: "Técnico",
      description: "Acesso aos sistemas e downloads",
      creationDate: "2025-03-05",
      status: false,
      permissions: [2, 5],
    },
  ];
}

export async function getAccessPermissions() {
  return [
    { id: 1, description: "Gestão de usuários" },
    { id: 2, description: "Gestão de sistemas" },
    { id: 3, description: "Feed de notícias" },
    { id: 4, description: "Gestão de laboratórios" },
    { id: 5, description: "Downloads" },
    { id: 6, description: "Gestão de acessos" },
  ];
}