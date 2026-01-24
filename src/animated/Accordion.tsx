import React, { useState } from 'react';
import {
  View,
  LayoutAnimation,
  UIManager,
  Platform,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import CustomMenu from '../components/CustomMenu';
import * as Config from '../helpers/Config';
import * as Icons from '../helpers/Icons';

interface AccordionItem {
  id: string | number;
  title?: string;
  data?: any[];
  [key: string]: any;
}
interface AccordionProps {
  data: AccordionItem[];
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const Accordion: React.FC<AccordionProps> = ({ data }) => {
  const [expandedIndex, setExpandedIndex] = useState<number>(-1);

  const toggleAccordion = (index: number): void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };
  const renderChildItem = (
    child: ListRenderItemInfo<any>,
    parentIndex: number,
  ) => {
    const { item } = child;
    if (expandedIndex !== parentIndex) return null;

    return (
      <View style={styles.content}>
        <CustomMenu
          tintColor2={Config.Colors.textColor.textColor_1}
          item={item}
          onPress={() => console.log('child pressed')}
          bottomImg={Icons.arrow_right}
          bottomImgBGColor={Config.Colors.defaultColor}
          titleColor={Config.Colors.textColor.textColor_1}
          style={{
            box: {
              borderRadius: 10,
              borderColor: Config.Colors.borderColor,
              borderBottomWidth: 0.6,
              backgroundColor: '#000',
            },
          }}
        />
      </View>
    );
  };
  const renderItem = ({ item, index }: ListRenderItemInfo<AccordionItem>) => {
    return (
      <View key={index} style={styles.item}>
        <CustomMenu
          tintColor2={Config.Colors.black}
          item={item}
          onPress={() => toggleAccordion(index)}
          bottomImg={
            expandedIndex === index ? Icons.arrow_down : Icons.arrow_forward
          }
          style={{
            box: {
              borderRadius: expandedIndex === index ? 0 : 10,
              borderBlockColor:
                expandedIndex === index
                  ? Config.Colors.borderColor
                  : Config.Colors.defaultColor,
              borderBottomWidth: 0.6,
            },
          }}
        />
        <FlatList
          renderItem={item => renderChildItem(item, index)}
          data={item?.data}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        renderItem={renderItem}
        data={data}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    margin: 10,
    backgroundColor: Config.Colors.defaultColor,
    borderRadius: 10,
  },
  header: {
    padding: 15,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {},
});

export default React.memo(Accordion);
