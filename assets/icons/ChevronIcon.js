import React from 'react';
import Svg, { Defs, Path, Use } from 'react-native-svg';
const ChevronIcon = props => (
    <Svg
        width={13}
        height={11}
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}>
        <Defs>
            <Path
                d="M6.772.268a.937.937 0 0 1 1.313 0l4.643 4.584a.908.908 0 0 1 0 1.296l-4.643 4.584a.937.937 0 0 1-1.313 0 .908.908 0 0 1 0-1.297L10.758 5.5 6.772 1.565a.908.908 0 0 1 0-1.297zm-6.5 0a.937.937 0 0 1 1.313 0l4.643 4.584a.908.908 0 0 1 0 1.296l-4.643 4.584a.937.937 0 0 1-1.313 0 .908.908 0 0 1 0-1.297L4.258 5.5.272 1.565a.908.908 0 0 1 0-1.297z"
                id="a"
            />
        </Defs>
        <Use fill="#000" fillRule="nonzero" xlinkHref="#a" />
    </Svg>
);

export default ChevronIcon;

