import { FC, PropsWithChildren } from 'react';
import { ViewProps } from 'react-native';
import { Box } from './Box';

type VStackProps = PropsWithChildren<ViewProps> & {
  space?: number;
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  wrap?: boolean;
};

export const VStack: FC<VStackProps> = ({
  children,
  space = 0,
  justify = 'flex-start',
  align = 'center',
  wrap = false,
  style,
  ...props
}) => {
  return (
    <Box
      className={`flex-col ${wrap ? 'flex-wrap' : 'flex-nowrap'}`}
      style={[
        {
          justifyContent: justify,
          alignItems: align,
          gap: space,
        },
        style,
      ]}
      {...props}>
      {children}
    </Box>
  );
};
