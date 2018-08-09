import * as React from 'react';
import { Field, FieldRenderProps, FieldProps as RFFieldProps } from 'react-final-form';
import { MergeRight } from '_helpers';

type BaseWrappedFieldProps = FieldRenderProps<any, HTMLElement> & {
  value?: any;
  onChange?: any;
};

// keys for pick props from RFFieldProps, Omit dont work because RFFieldProps have index signature
type RFFieldPropKey =
  | 'allowNull'
  | 'format'
  | 'formatOnBlur'
  | 'parse'
  | 'name'
  | 'isEqual'
  | 'subscription'
  | 'validate'
  | 'value';

export function getFieldWithComponent<P extends BaseWrappedFieldProps>(
  Component: React.ComponentType<P>,
  type?: string,
) {
  type OwnProps = Omit<P, keyof BaseWrappedFieldProps>;
  type FieldProps = Pick<RFFieldProps<any, HTMLElement>, RFFieldPropKey>;
  type ResultProps = MergeRight<OwnProps, FieldProps>;

  const result: React.StatelessComponent<ResultProps> = (props: ResultProps) => (
    <Field type={type} {...props} component={Component} />
  );
  result.displayName = `FieldWithComponent(${Component.displayName ||
    Component.name ||
    'Component'})`;
  return result;
}
