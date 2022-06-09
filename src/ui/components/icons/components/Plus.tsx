import React from 'react';

type Props = {
    color?: string;
    width?: number | string;
    height?: number | string;
    strokeWidth?: number;
    className?: string; // Required to apply styling via Styled-Components
} & React.SVGProps<SVGSVGElement>;

// eslint-disable-next-line react/display-name
const Plus = React.forwardRef<SVGSVGElement, Props>((props, ref) => {
    const {width, height, color, strokeWidth, ...others} = props;

    return (
        <svg
            width={width}
            height={height}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ref={ref}
            {...others}
        >
            <path
                d="M12 5v14M5 12h14"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
});

Plus.defaultProps = {
    color: '#000000',
    width: 15,
    height: 15,
    strokeWidth: 2,
};

export default Plus;