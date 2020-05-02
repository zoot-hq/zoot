
// import React from 'react';
// import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg';
// const InfoIcon = props => (
//     <Svg
//         width={19}
//         height={19}
//         xmlnsXlink="http://www.w3.org/1999/xlink"
//         {...props}>
//         <Defs>
//             <Path
//                 d="M9.5.792a8.708 8.708 0 1 1 0 17.416A8.708 8.708 0 0 1 9.5.792zm0 1.583a7.125 7.125 0 1 0 0 14.25 7.125 7.125 0 0 0 0-14.25zm0 6.333c.437 0 .792.355.792.792v3.167a.792.792 0 0 1-1.584 0V9.5c0-.437.355-.792.792-.792zm-.56-2.143a.792.792 0 1 1 1.12 1.12.792.792 0 0 1-1.12-1.12z"
//                 id="a"
//             />
//         </Defs>
//         <G fill="none" fillRule="evenodd">
//             <Mask id="b" fill="#fff">
//                 <Use xlinkHref="#a" />
//             </Mask>
//             <Use fill="#000" fillRule="nonzero" xlinkHref="#a" />
//             <G mask="url(#b)" fill="#000">
//                 <Path d="M0 0h19v19H0z" />
//             </G>
//         </G>
//     </Svg>
// );

// export default InfoIcon;

import React from 'react';
import Svg, { Defs, Path, Use } from 'react-native-svg';
const InfoIcon = props => (
    <Svg
        width={19}
        height={19}
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}>
        <Defs>
            <Path
                d="M9.5.792a8.708 8.708 0 1 1 0 17.416A8.708 8.708 0 0 1 9.5.792zm0 1.583a7.125 7.125 0 1 0 0 14.25 7.125 7.125 0 0 0 0-14.25zm0 6.333c.437 0 .792.355.792.792v3.167a.792.792 0 0 1-1.584 0V9.5c0-.437.355-.792.792-.792zm-.56-2.143a.792.792 0 1 1 1.12 1.12.792.792 0 0 1-1.12-1.12z"
                id="a"
            />
        </Defs>
        <Use fill="#000" fillRule="nonzero" xlinkHref="#a" />
    </Svg>
);

export default InfoIcon;



