import React from 'react';
import Get_Content_Data from '../../common/Get_Content_Data';

const Terms_Conditions = ({navigation}:any) => {
  return (
    <Get_Content_Data
      slug={`terms-conditions`}
      dataStoreKey={`termsCondition`}
      headerText={`Terms and Conditions`}
      navigation={navigation}
    />
  );
};

export default React.memo(Terms_Conditions);
