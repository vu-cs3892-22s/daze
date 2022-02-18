import { Text, StyleSheet } from "react-native";
import React from "react";
import { Box } from "native-base";

const styles = StyleSheet.create({
  cardNameText: {
    fontSize: 25,
    color: "#616265",
    lineHeight: 30,
  },
  cardImage: {
    resizeMode: "stretch",
  },
});

interface VenueCardProps {
  name: String;
  line: String;
}

interface VenueCardBaseProps {
  children?: React.ReactElement[];
  line: String;
}

const getBackgroundColor = (line: String) => {
  switch (line) {
    case "s":
      return "#B0DF63";
    case "m":
      return "#FFFA76";
    case "l":
      return "#FF9B70";
    default:
      return "#E76666";
  }
};

const VenueCardBase = ({ children, line }: VenueCardBaseProps) => (
  <Box
    borderRadius={25}
    minWidth={"100%"}
    maxWidth={"100%"}
    bg={getBackgroundColor(line)}
    margin={0}
    marginBottom={5}
    flexDirection={"column"}
    overflow="hidden"
  >
    {children &&
      React.Children.map(children, (child) =>
        React.cloneElement(child, {
          style: { ...child.props.style, opacity: 1 },
        })
      )}
  </Box>
);

export default function VenueCard(props: VenueCardProps) {
  return (
    <VenueCardBase line={props.line}>
      <Box></Box>
      <Box padding="20px 1px 0 1px">
        <Text style={styles.cardNameText}>{props.name}</Text>
      </Box>
    </VenueCardBase>
  );
}

// export default function VenueCard(props: VenueCardProps) {
//   return (
//     <VenueCardBase line={props.line}>
//       <Box>
//         <AspectRatio w="100%" ratio={16 / 9}>
//             <Image
//               source={{
//                 uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg",
//               }}
//             //   source={require('../assets/pho.jpeg')}
//               style={styles.cardImage}
//               alt="image"
//             />
//         </AspectRatio>
//       </Box>
//       <Box padding="20px 1px 0 1px">
//         <Text style={styles.cardNameText}>{props.name}</Text>
//       </Box>
//     </VenueCardBase>
//   );
// }
