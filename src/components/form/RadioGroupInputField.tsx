import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { GetProps } from '_helpers';

import { getFieldWithComponent } from 'utils/react';

import { RadioGroupInput } from '../inputs';

type IProps = GetProps<typeof RadioGroupInput> & FieldRenderProps<any, HTMLElement>;

function RadioGroupInputFieldComponent(props: IProps) {
  const { input, meta, ...rest } = props;
  const error =
    typeof rest.error === 'boolean' ? rest.error && meta.error : meta.touched && meta.error;
  return <RadioGroupInput {...rest} helperText={error} error={Boolean(error)} {...input} />;
}

export const RadioGroupInputField = getFieldWithComponent(RadioGroupInputFieldComponent);
