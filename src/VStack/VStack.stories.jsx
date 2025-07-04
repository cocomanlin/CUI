import { default as VStack } from "./VStack.jsx";

export default {
  title: "Components/VStack",
  component: VStack,
  tags: ["autodocs"],
};

export const Primary = {
  render: (args) => (
    <VStack {...args}>
    </VStack>
  ),
  args: {
    spacing: "10",
  },
};
