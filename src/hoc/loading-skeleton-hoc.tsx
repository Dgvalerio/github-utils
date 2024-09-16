import {
  Attributes,
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';

export const withLoadingSkeleton = <T extends { loading?: boolean }>(
  Skeleton: FC<T>,
  Component: FC<T>
): FC<T & Attributes> => {
  const Handler: FC<T & Attributes> = (props) =>
    props.loading ? <Skeleton {...props} /> : <Component {...props} />;

  const displayName = Component.displayName || Component.name || 'Component';

  Handler.displayName = `withLoadingSkeleton(${displayName})`;

  return Handler;
};

export const withLoadingSkeletonAndRef = <
  Props extends { loading?: boolean },
  Refs = undefined,
>(
  Skeleton: FC<Props>,
  Component: ForwardRefExoticComponent<Props & RefAttributes<Refs>>
): ForwardRefExoticComponent<PropsWithoutRef<Props> & RefAttributes<Refs>> => {
  const Handler = forwardRef<Refs, Props>((props, ref) =>
    props.loading ? (
      <Skeleton {...(props as Props)} />
    ) : (
      <Component {...(props as Props)} ref={ref} />
    )
  );

  const displayName = Component.displayName || Component.name || 'Component';

  Handler.displayName = `withLoadingSkeleton(${displayName})`;

  return Handler;
};
