import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { GetProps } from '_helpers';

import { getFieldWithComponent } from 'utils/react';

import { TextInput } from '../inputs';

type IProps = Omit<GetProps<typeof TextInput>, 'ref'> & FieldRenderProps<any, HTMLElement>;

function TextInputFieldComponent(props: IProps) {
  const { input, meta, ...rest } = props;
  const error =
    typeof rest.error === 'boolean' ? rest.error && meta.error : meta.touched && meta.error;
  return <TextInput {...rest} helperText={error} error={Boolean(error)} {...input} />;
}

export const TextInputField = getFieldWithComponent(TextInputFieldComponent);
