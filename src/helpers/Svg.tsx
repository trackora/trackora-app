import { View, Text } from "react-native";
import React from "react";
import * as Config from "./Config";
import { G, Path, Rect, Svg } from "react-native-svg";
import { Circle } from "react-native-maps";
import { widthToDp } from "./Responsive";

interface SvgProps {
  width: number;
  height: number;
}
export const SvgCalender = ({ width, height }: SvgProps) => {
  return (
    <View>
      <Svg
        width="40"
        height="20"
        viewBox="0 0 11.7 13"
      >
        <Path
          id="calender"
          d="M13.4,2.3h-.65V1h-1.3V2.3H6.25V1H4.95V2.3H4.3A1.294,1.294,0,0,0,3.007,3.6L3,12.7A1.3,1.3,0,0,0,4.3,14h9.1a1.3,1.3,0,0,0,1.3-1.3V3.6A1.3,1.3,0,0,0,13.4,2.3Zm0,10.4H4.3V5.55h9.1ZM5.6,6.85H8.85V10.1H5.6Z"
          transform="translate(-3 -1)"
          fill="#254e71"
        />
      </Svg>
    </View>
  );
};

export const SvgRefreshBtn = ({
  color = "#fff",
  viewBox = "0 0 18 22",
  commonWidth = "50",
  commonHeight = "40",
}) => {
  return (
    <Svg width={commonWidth} height={commonHeight} viewBox={viewBox}>
      <Path
        id="refrace"
        d="M12,4V1L8,5l4,4V6a6,6,0,0,1,6,6,5.87,5.87,0,0,1-.7,2.8l1.46,1.46A7.986,7.986,0,0,0,12,4Zm0,14a6,6,0,0,1-6-6,5.87,5.87,0,0,1,.7-2.8L5.24,7.74A7.986,7.986,0,0,0,12,20v3l4-4-4-4Z"
        transform="translate(-4 -1)"
        fill={color}
      ></Path>
    </Svg>
  );
};
export const SvgArrowBack = () => {
  return (
    <Svg width="60" height="40" viewBox="0 0 25 22">
      <Path
        id="ic_arrow_back"
        d="M20,11H7.83l5.59-5.59L12,4,4,12l8,8,1.41-1.41L7.83,13H20Z"
        transform="translate(-4 -4)"
        fill="#ad3b45"
      />
    </Svg>
  );
};

export const SvgcCircle = () => {
  return (
    <Svg width="123" height="123" viewBox="0 0 123 123">
      <Rect
        id="circle"
        width="123"
        height="123"
        rx="61.5"
        fill="rgba(0,0,0,0.13)"
      />
    </Svg>
  );
};

export const Lines_1 = () => {
  return (
    <Svg
      id="line_1"
      width="300"
      height="100"
      viewBox="0 0 200 50"
    >
      <Rect
        id="Rectangle_4602"
        data-name="Rectangle 4602"
        width="200"
        height="10"
        transform="translate(0 50)"
        fill="#204462"
      />
      <Rect
        id="Rectangle_4603"
        data-name="Rectangle 4603"
        width="150"
        height="10"
        transform="translate(0 25)"
        fill="#204462"
      />
      <Rect
        id="Rectangle_4604"
        data-name="Rectangle 4604"
        width="100"
        height="10"
        fill="#204462"
      />
    </Svg>
  );
};

export const Lines_2 = () => {
  return (
    <View>
      <Svg
        id="line_1"
        width="300"
        height="100"
        viewBox="0 0 200 50"
      >
        <Rect
          id="Rectangle_4608"
          data-name="Rectangle 4608"
          width="200"
          height="10"
          transform="translate(0 50)"
          fill="#204462"
        />
        <Rect
          id="Rectangle_4607"
          data-name="Rectangle 4607"
          width="150"
          height="10"
          transform="translate(50 25)"
          fill="#204462"
        />
        <Rect
          id="Rectangle_4606"
          data-name="Rectangle 4606"
          width="100"
          height="10"
          transform="translate(100)"
          fill="#204462"
        />
      </Svg>
    </View>
  );
};
export const ic_arrow_forward = () => {
  return (
    <Svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
    >
      <Path
        id="ic_arrow_forward"
        d="M9,4l-.881.881,3.488,3.494H4v1.25h7.606L8.119,13.119,9,14l5-5Z"
        transform="translate(-4 -4)"
      />
    </Svg>
  );
};
export const NotFound_result = `<svg xmlns="http://www.w3.org/2000/svg" width=${widthToDp(
  100,
)} height=${widthToDp(50)} viewBox="0 0 121.024 121.125">
<g id="no-result" transform="translate(334 -246.9)">
  <path id="path4" d="M-288.8,297.7l5.7-5.7,42.4,42.4-5.7,5.7Z" fill=${
    Config.Colors.themeColor
  }/>
  <path id="path6" d="M-240.7,334.5l-5.7,5.7a3.984,3.984,0,0,0-1.2,2.85,3.984,3.984,0,0,0,1.2,2.85l19.8,19.8a8.028,8.028,0,0,0,11.3,0,8.028,8.028,0,0,0,0-11.3l-19.8-19.9a3.866,3.866,0,0,0-2.8-1.2,3.866,3.866,0,0,0-2.8,1.2Z" fill=${
    Config.Colors.themeColor
  }/>
  <circle id="circle8" cx="48" cy="48" r="48" transform="translate(-334 246.9)" fill=${
    Config.Colors.themeColor
  }/>
  <circle id="circle10" cx="36" cy="36" r="36" transform="translate(-322 258.9)" fill=${
    Config.Colors.defaultColor
  }/>
  <circle id="circle12" cx="5" cy="5" r="5" transform="translate(-309 285.9)" fill=${
    Config.Colors.themeColor
  }/>
  <circle id="circle14" cx="5" cy="5" r="5" transform="translate(-273 285.9)" fill=${
    Config.Colors.themeColor
  }/>
  <path id="path16" d="M-276.2,312.9a2.025,2.025,0,0,0,1.522-.7,2.025,2.025,0,0,0,.478-1.6,12.108,12.108,0,0,0-11.8-9.7,12.108,12.108,0,0,0-11.8,9.7,2.025,2.025,0,0,0,.478,1.6,2.025,2.025,0,0,0,1.522.7Z" fill=${
    Config.Colors.themeColor
  }/>
</g>
</svg>`;
export const Search_icon = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg>`;
