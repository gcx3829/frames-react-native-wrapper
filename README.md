This project is a simple React Native wrapper of [Checkout.com Frames](https://docs.checkout.com/docs/frames).

# Install

```bash
npm install frames-react-native-wrapper
```

# Demo

![Image of Demo](https://upload.cc/i1/2021/03/07/r7YQqw.gif)

# Example Usage

```js
import { Frames } from "frames-react";

/**
 * ...other code
 */

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
    ready={() => {}}
    frameActivated={(e) => {}}
    frameFocus={(e) => {}}
    frameBlur={(e) => {}}
    frameValidationChanged={(e) => {}}
    paymentMethodChanged={(e) => {}}
    cardValidationChanged={(e) => {}}
    cardSubmitted={() => {}}
    cardTokenized={(e) => {}}
    cardTokenizationFailed={(e) => {}}
    submitCardCreator={(submitCard) => {}}
/>
```

# Props

| prop                   | required | description                                                                                                                      |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| config                 | true     |See [Checkout.com Frames](https://docs.checkout.com/docs/frames-reference#section-configuration-options).                         |
| ready                  | false    |Triggered when Frames is registered on the global namespace and safe to use.                                                      |
| frameActivated         |  false   |Triggered when the form is rendered.                                                                                              |
| frameFocus             | false    |Triggered when an input field receives focus. Use it to check the validation status and apply the wanted UI changes.              |
| frameBlur              | false    |Triggered after an input field loses focus. Use it to check the validation status and apply the wanted UI changes.                |
| frameValidationChanged | false    |Triggered when a field's validation status has changed. Use it to show error messages or update the UI.                           |
| paymentMethodChanged   | false    |Triggered when a valid payment method is detected based on the card number being entered. Use this event to change the card icon. |
| cardValidationChanged  | false    |Triggered when the state of the card validation changes.                                                                          |
| cardSubmitted          | false    |Triggered when the card form has been submitted.                                                                                  |
| cardTokenized          | true     |Triggered after a card is tokenized.                                                                                              |
| submitCardCreator      | true     |Return static function `submitCard` for tokenization                                                                              | 