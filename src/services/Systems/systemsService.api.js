// import axios from "axios";
import image360 from "~/assets/Systems/360.png";
import imageOne from "~/assets/Systems/One.png";
import imageAzure from "~/assets/Systems/Azure.png";
export async function getSystems() {
  // const response = await axios.get("url");
  // return response.data;
  return [
    {
      id: 1,
      name: "KinesiOS 360",
      version: "2.5.0",
      size: "125 MB",
      description: "Sistema para reabilitação motora e neurofuncional que utiliza o Kinect 360",
      categoryId: 1,
      imageUrl: image360
    },
    {
      id: 2,
      name: "KinesiOS One",
      version: "1.8.3",
      size: "85 MB",
      description: "Sistema para reabilitação motora e neurofuncional que utiliza o Kinect One",
      categoryId: 2,
      imageUrl: imageOne
    },
    {
      id: 3,
      name: "KinesiOS Azure",
      version: "3.2.1",
      size: "95 MB",
      description: "Sistema para reabilitação motora e neurofuncional que utiliza o Kinect Azure",
      categoryId: 2,
      imageUrl: imageAzure
    },
  ];
}

export async function getSystemCategories(){
  return [
    {
      id: 1,
      name: "Gestão",
    },
    {
      id: 2,
      name: "Outros",
    }
  ]
}