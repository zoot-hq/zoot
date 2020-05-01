import React from 'react';
import Svg, { Path } from 'react-native-svg';
const ResourceIcon = props => (
    <Svg width={25} height={30} {...props}>
        <Path
            d="M22.34 0H6.22c-.423.003-.841.082-1.236.232L4.754 0l-.938.94-.15.15-2.403 2.415a3.402 3.402 0 0 0-.482.484L0 4.773l.258.075A3.421 3.421 0 0 0 0 6.136v20.455C0 28.474 1.52 30 3.395 30h14.26a3.344 3.344 0 0 0 1.643-.443l.495.416 2.451-2.953a3.408 3.408 0 0 0 2.2-3.156V0H22.34zm.067 2.045v21.819a1.311 1.311 0 0 1-.461.975l-.32-.266-.53.64h-.047v-22.5H4.964c.279-.423.75-.679 1.256-.681l16.187.013zM11.543 4.773h2.716v6.054L12.684 9.56l-1.14 1.057V4.773zM3.395 27.955a1.36 1.36 0 0 1-1.358-1.364V6.136a1.36 1.36 0 0 1 1.358-1.363h6.111v10.52l3.273-3.034 3.517 2.823V4.772h2.716v21.819a1.36 1.36 0 0 1-1.358 1.364H3.395z"
            fill="#000"
            fillRule="evenodd"
        />
    </Svg>
);

export default ResourceIcon;
