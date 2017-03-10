/**
 * @providesModule WebViewAndroid
 */

import React, { Component } from 'react';
import {
  requireNativeComponent,
  NativeModules,
  findNodeHandle,
  View,
} from 'react-native';

const {
  UIManager,
  // RNWebViewAndroid,
} = NativeModules;

const RNWebViewAndroid = requireNativeComponent('RNWebViewAndroid', null);

const WebViewState = {
  IDLE: 0,
  LOADING: 1,
  ERROR: 2,
  STOP: 3,
};

// const WEBVIEW_REF = 'androidWebView';

class WebViewAndroid extends Component {
  static propTypes = {
    url: React.PropTypes.string,
    source: React.PropTypes.object,
    baseUrl: React.PropTypes.string,
    html: React.PropTypes.string,
    htmlCharset: React.PropTypes.string,
    userAgent: React.PropTypes.string,
    injectedJavaScript: React.PropTypes.string,
    disablePlugins: React.PropTypes.bool,
    disableCookies: React.PropTypes.bool,
    javaScriptEnabled: React.PropTypes.bool,
    geolocationEnabled: React.PropTypes.bool,
    allowUrlRedirect: React.PropTypes.bool,
    builtInZoomControls: React.PropTypes.bool,
    onNavigationStateChange: React.PropTypes.func,
    startInLoadingState: React.PropTypes.bool,
    renderLoading: React.PropTypes.func,
  };

  static defaultProps = {
    startInLoadingState: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      viewState: props.startInLoadingState ? WebViewState.LOADING : WebViewState.IDLE,
    };

    this._onNavigationStateChange = this._onNavigationStateChange.bind(this);
  }

  _onNavigationStateChange(event) {
    if (event.loading && this.state.viewState !== WebViewState.LOADING) {
      this.setState({ viewState: WebViewState.LOADING });
    } else if (!event.loading && this.state.viewState === WebViewState.LOADING) {
      this.setState({ viewState: WebViewState.IDLE });
    }
    if (this.props.onNavigationStateChange) {
      this.props.onNavigationStateChange(event.nativeEvent);
    }
  }

  goBack() {
    UIManager.dispatchViewManagerCommand(
      this._getWebViewHandle(),
      UIManager.RNWebViewAndroid.Commands.goBack,
      null
    );
  }

  goForward() {
    UIManager.dispatchViewManagerCommand(
      this._getWebViewHandle(),
      UIManager.RNWebViewAndroid.Commands.goForward,
      null
    );
  }

  reload() {
    UIManager.dispatchViewManagerCommand(
      this._getWebViewHandle(),
      UIManager.RNWebViewAndroid.Commands.reload,
      null
    );
  }

  stopLoading() {
    UIManager.dispatchViewManagerCommand(
      this._getWebViewHandle(),
      UIManager.RNWebViewAndroid.Commands.stopLoading,
      null
    );
  }

  render() {

    let otherView = null;

    if (this.state.viewState === WebViewState.LOADING && this.props.renderLoading) {
      otherView = this.props.renderLoading;
    }

    const webView = (
      <RNWebViewAndroid
        ref={(vw) => this.webViewRef = vw}
        {...this.props}
        onNavigationStateChange={this._onNavigationStateChange}
      />
    );
    return (
      <View style={{ flex: 1 }}>
        {webView}
        {otherView}
      </View>
    );
  }

  _getWebViewHandle() {
    return findNodeHandle(this.webViewRef);
  }
}

export default WebViewAndroid;
