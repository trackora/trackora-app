import React from 'react';
import Get_Content_Data from '../../common/Get_Content_Data';

const Privacy_Policy = ({ navigation }) => {
  return (
    <Get_Content_Data
      slug={`privacy-policy`}
      dataStoreKey={`privacyPolicy`}
      headerText={`Privacy Policy`}
      navigation={navigation}
    />
  );
};
export default React.memo(Privacy_Policy);
