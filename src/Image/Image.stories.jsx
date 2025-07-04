import { default as Image } from "./Image.jsx";

export default {
  title: "Components/Image",
  component: Image,
  tags: ["autodocs"],
};

export const Primary = {
  render: (args) => <Image {...args} />,
  args: {
    systemName: "heart",
  },
};

export const WithLayers = {
  render: (args) => <Image {...args} />,
  args: {
    url: "https://placehold.co/100",
    variant: "photo-square",
    layers: {
      container: { style: { border: "1px solid red", padding: "4px" } },
      img: { alt: "Layered", style: { borderRadius: "4px" } },
    },
  },
};
