import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type HighlightCardProps = {
  imageSource: any;
  title: string;
};

const HighlightCard: React.FC<HighlightCardProps> = ({ imageSource, title }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.imageCard}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 240,
    marginRight: 14,
  },
  imageCard: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
});

export default HighlightCard;
