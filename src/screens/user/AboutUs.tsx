import React from 'react';
import Get_Content_Data from '../../common/Get_Content_Data';

const AboutUs = ({navigation}) => {
  return (
    <Get_Content_Data
      slug={`about-us`}
      dataStoreKey={`aboutUsData`}
      headerText={`About us`}
      navigation={navigation}
    />
  );
};

export default React.memo(AboutUs);
