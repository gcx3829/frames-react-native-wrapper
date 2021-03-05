import React from 'react';
import renderer from 'react-test-renderer';
import { Frames } from '../src/index';

test('renders correctly', () => {
  const tree = renderer
    .create(
      <Frames
        config={{
          debug: true,
          publicKey: 'pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73',
        }}
        cardTokenized={(event) => console.log(event.token)}
        submitCardCreator={(childSubmitCard) => console.log(childSubmitCard)}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
