/* eslint-disable no-undef */
import 'react-native';
import React from 'react';
import { Frames } from '../index';
import renderer from 'react-test-renderer';

let submitCardFunction;
const FramesComponent = (
  <Frames
    config={{
      debug: true,
      publicKey: 'pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73',
      localization: {
        cardNumberPlaceholder: 'Card number',
        expiryMonthPlaceholder: 'MM',
        expiryYearPlaceholder: 'YY',
        cvvPlaceholder: 'CVV',
      },
      style: {
        base: {
          fontSize: '17px',
        },
      },
    }}
    cardTokenized={(event) => {
      console.log(event);
    }}
    submitCardCreator={(submitCard) => (submitCardFunction = submitCard)}
  />
);

describe('<Frames />', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(FramesComponent);
    expect(tree).toMatchSnapshot();
  });

  it('should return submitCard function', () => {
    renderer.create(FramesComponent);
    expect(submitCardFunction).toBeInstanceOf(Function);
  });
});
