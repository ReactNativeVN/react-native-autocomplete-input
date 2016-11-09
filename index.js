import React, { Component, PropTypes } from 'react';
import {
  TouchableOpacity,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class AutoComplete extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    /**
     * These styles will be applied to the container which
     * surrounds the autocomplete component.
     */
    containerStyle: View.propTypes.style,
    /**
     * Assign an array of data objects which should be
     * rendered in respect to the entered text.
     */
    data: PropTypes.array,
    /*
     * These styles will be applied to the container which surrounds
     * the textInput component.
     */
    inputContainerStyle: View.propTypes.style,
    /**
     * These style will be applied to the result list view.
     */
    listStyle: ListView.propTypes.style,
    /**
     * `renderItem` will be called to render the data objects
     * which will be displayed in the result view below the
     * text input.
     */
    renderItem: PropTypes.func,
    /**
     * `onShowResults` will be called when list is going to
     * show/hide results.
     */
    onShowResults: PropTypes.func,

    clear: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    defaultValue: '',
    clear: false,
    renderItem: rowData => <Text>{rowData}</Text>
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(props.data),
      showResults: props.data && props.data.length > 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const dataSource = this.state.dataSource.cloneWithRows(nextProps.data);
    this._showResults(dataSource.getRowCount() > 0);
    this.setState({ dataSource });
  }

  /**
   * Proxy `blur()` to autocomplete's text input.
   */
  blur() {
    const { textInput } = this;
    textInput && textInput.blur();
  }

  /**
   * Proxy `focus()` to autocomplete's text input.
   */
  focus() {
    const { textInput } = this;
    textInput && textInput.focus();
  }

  clearInput() {
    const { textInput } = this;
    textInput.clear();
    const dataSource = this.state.dataSource.cloneWithRows([]);
    this.setState({ dataSource });
  }

  _renderItems() {
    const { listStyle, renderItem } = this.props;
    const { dataSource } = this.state;
    return (
      <ListView
        dataSource={dataSource}
        keyboardShouldPersistTaps={true}
        renderRow={renderItem}
        style={[styles.list, listStyle]}
      />

    );
  }

  _showResults(show) {
    const { showResults } = this.state;
    const { onShowResults } = this.props;

    if (!showResults && show) {
      this.setState({ showResults: true });
      onShowResults && onShowResults(true);
    } else if (showResults && !show) {
      this.setState({ showResults: false });
      onShowResults && onShowResults(false);
    }
  }

  render() {
    const { showResults } = this.state;
    const { clear, containerStyle, inputContainerStyle, onEndEditing, style, ...props } = this.props;
    let clearUI;
    if (clear) {
      clearUI = (
        <TouchableOpacity onPress={() => this.clearInput()}>
          <View style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <MaterialIcons name="clear" color='#dddddd' size={38} />
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>
          <View style={{flexDirection:'row', justifyContent: 'space-between', backgroundColor: 'white', height: 40}}>
            <TextInput
              style={[styles.input]}
              ref={ref => (this.textInput = ref)}
              onEndEditing={e =>
                this._showResults(false) || (onEndEditing && onEndEditing(e))
              }
              {...props}
            />
            {clearUI}
          </View>
        </View>
        {showResults && this._renderItems()}
      </View>
    );
  }
}

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 1
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainer: {
    margin: 10,
    marginBottom: 0,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3
  },
  list: {
    ...border,
    borderTopWidth: 0,
    margin: 10,
    marginTop: 0
  }
});

export default AutoComplete;
