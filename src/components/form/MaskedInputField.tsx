import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { GetProps } from '_helpers';

import { getFieldWithComponent } from 'utils/react';

import { MaskedInput } from '../inputs';

type IProps = Omit<GetProps<typeof MaskedInput>, 'ref'> & FieldRenderProps<any, HTMLElement>;

function MaskedInputFieldComponent(props: IProps) {
  const { input, meta, ...rest } = props;
  const error =
    typeof rest.error === 'boolean' ? rest.error && meta.error : meta.touched && meta.error;
  return <MaskedInput {...rest} helperText={error} error={Boolean(error)} {...input} />;
}

export const MaskedInputField = getFieldWithComponent(MaskedInputFieldComponent);
