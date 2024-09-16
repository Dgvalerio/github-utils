import React, { FC } from 'react';

import { ExtraSymbol } from '@/components/icon/icon.types';
import { GoogleIcon } from '@/components/icon/icons/google';
import { cn } from '@/lib/tailwind/utils';

import { Property } from 'csstype';
import { MaterialSymbol } from 'material-symbols';

export type MaterialIcon = MaterialSymbol | ExtraSymbol;

export interface IconProps {
  icon: MaterialIcon;
  size?: Property.FontSize<string | number>;
  color?: Property.Color;
  weight?: Property.FontWeight;
  fill?: boolean;
  rotation?: number;
  className?: HTMLSpanElement['className'];
}

// Veja os ícones disponíveis em https://marella.me/material-symbols/demo/
export const Icon: FC<IconProps> = ({ icon, ...props }) => {
  switch (icon) {
    case 'google':
      return <GoogleIcon {...props} />;
    default:
      const { size, color, weight, fill, rotation, className } = props;

      return (
        <span
          className={cn(
            'material-symbols-rounded',
            fill && "[font-variation-settings:'FILL'1]",
            className
          )}
          style={{
            fontSize: size,
            color,
            fontWeight: weight,
            transform: rotation ? `rotate(${rotation}deg)` : undefined,
          }}
          translate="no"
        >
          {icon}
        </span>
      );
  }
};
