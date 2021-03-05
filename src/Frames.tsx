import React, { useEffect } from 'react';
import { View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import {
  FramesProps,
  FrameElement,
  FrameValidationChangedEvent,
  FrameCardTokenizedEvent,
  FrameCardTokenizationFailedEvent,
  FramePaymentMethodChangedEvent,
  FrameCardValidationChangedEvent,
} from './types/types';
import { CDN } from './config/config';

export const Frames = ({
  config,
  ready,
  frameActivated,
  frameFocus,
  frameBlur,
  frameValidationChanged,
  paymentMethodChanged,
  cardValidationChanged,
  cardSubmitted,
  cardTokenized,
  cardTokenizationFailed,
  submitCardCreator,
  containerStyle,
  children,
}: FramesProps): React.ReactElement => {
  const frameEvents = {
    CARD_TOKENIZATION_FAILED: 'cardTokenizationFailed',
    CARD_TOKENIZED: 'cardTokenized',
    CARD_SUBMITTED: 'cardSubmitted',
    CARD_VALIDATION_CHANGED: 'cardValidationChanged',
    FRAME_ACTIVATED: 'frameActivated',
    FRAME_BLUR: 'frameBlur',
    FRAME_FOCUS: 'frameFocus',
    FRAME_VALIDATION_CHANGED: 'frameValidationChanged',
    PAYMENT_METHOD_CHANGED: 'paymentMethodChanged',
    READY: 'ready',
  };
  // Ref of webview element.
  let webview: any;

  useEffect(() => {
    submitCardCreator(submitCard);

    return () => {
      if (webview) {
        Object.keys(frameEvents).forEach((event) =>
          webview.injectJavaScript(
            `window.Frames.removeAllEventHandlers(window.Frames.Events.${event});`,
          ),
        );
      }
    };
  });

  const init = () => {
    const _config = {
      publicKey: config.publicKey,
      debug: config.debug || false,
      style: config.style,
      cardholder: config.cardholder,
      localization: config.localization,
    };
    if (!config.cardholder) {
      delete _config.cardholder;
    }
    if (!config.localization) {
      delete _config.localization;
    }

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <script src="${CDN}"></script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
        <style>
          * { margin: 0; padding: 0; }
          .one-liner { display:flex; flex-direction:column; }
          .card-frame { border:solid 1px #545AFA; border-radius:8px; width: calc(100% - 2px); height: 48px; padding-vertical: 16px; line-height: 24px; }
        </style>
      </head>
      <body>          
        <form id="payment-form" method="POST" action="#">
          <div class="one-liner">
            <div class="card-frame"></div>
            <input type="submit" id="pay-button" hidden />
          </div>
        </form>
        <script>
          const frameEvents = [
            'CARD_TOKENIZATION_FAILED',
            'CARD_TOKENIZED',
            'CARD_VALIDATION_CHANGED',
            'FRAME_ACTIVATED',
            'FRAME_BLUR',
            'FRAME_FOCUS',
            'FRAME_VALIDATION_CHANGED',
            'PAYMENT_METHOD_CHANGED',
            'READY',
          ];
          var payButton = document.getElementById("pay-button");
          var form = document.getElementById("payment-form");
          Frames.init(${JSON.stringify(_config)});
          frameEvents.forEach((event) => {
            Frames.addEventHandler(
              Frames.Events[event],
              function (frameEvent) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: Frames.Events[event], data: frameEvent }));
              }
            );
          });
          form.addEventListener("submit", function (event) {
            event.preventDefault();
            Frames.submitCard();
          });
        </script>
      </body>
    </html>`;
  };

  interface parsedEvent {
    event: string;
    data:
      | FrameElement
      | FrameValidationChangedEvent
      | FrameCardTokenizedEvent
      | FramePaymentMethodChangedEvent
      | FrameCardTokenizationFailedEvent
      | FrameCardValidationChangedEvent;
  }

  const eventHandler = (event: WebViewMessageEvent) => {
    if (event.nativeEvent?.data) {
      const parsedEvent = JSON.parse(event.nativeEvent.data) as parsedEvent;

      switch (parsedEvent.event) {
        case frameEvents.READY:
          ready ? ready() : void 0;
          break;
        case frameEvents.FRAME_ACTIVATED:
          frameActivated
            ? frameActivated(parsedEvent.data as FrameElement)
            : void 0;
          break;
        case frameEvents.FRAME_FOCUS:
          frameFocus ? frameFocus(parsedEvent.data as FrameElement) : void 0;
          break;
        case frameEvents.FRAME_BLUR:
          frameBlur ? frameBlur(parsedEvent.data as FrameElement) : void 0;
          break;
        case frameEvents.FRAME_VALIDATION_CHANGED:
          frameValidationChanged
            ? frameValidationChanged(
                parsedEvent.data as FrameValidationChangedEvent,
              )
            : void 0;
          break;
        case frameEvents.PAYMENT_METHOD_CHANGED:
          paymentMethodChanged
            ? paymentMethodChanged(
                parsedEvent.data as FramePaymentMethodChangedEvent,
              )
            : void 0;
          break;
        case frameEvents.CARD_VALIDATION_CHANGED:
          cardValidationChanged
            ? cardValidationChanged(
                parsedEvent.data as FrameCardValidationChangedEvent,
              )
            : void 0;
          break;
        case frameEvents.CARD_SUBMITTED:
          cardSubmitted ? cardSubmitted() : void 0;
          break;
        case frameEvents.CARD_TOKENIZED:
          cardTokenized
            ? cardTokenized(parsedEvent.data as FrameCardTokenizedEvent)
            : void 0;
          break;
        case frameEvents.CARD_TOKENIZATION_FAILED:
          cardTokenizationFailed
            ? cardTokenizationFailed(
                parsedEvent.data as FrameCardTokenizationFailedEvent,
              )
            : void 0;
          break;
        default:
          void 0;
      }
    }
  };

  /**
   * Submits the card form if all form values are valid.
   *
   * @static
   * @memberof Frames
   * @return {Promise<FrameCardTokenizedEvent>}
   */
  const submitCard = (): void => {
    webview.injectJavaScript(`document.getElementById("pay-button").click();`);
  };

  return (
    <View style={[{ height: 50 }, containerStyle]}>
      <WebView
        ref={(ref) => (webview = ref)}
        source={{
          html: init(),
        }}
        mixedContentMode="compatibility"
        onMessage={eventHandler}
        style={{ opacity: 0.99, backgroundColor: 'red' }}
      />
      {children}
    </View>
  );
};
