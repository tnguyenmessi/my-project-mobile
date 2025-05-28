import React, { Fragment } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { IconButton } from 'react-native-paper';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

export const EditorScreen = () => {
  return (
    <Fragment>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={styles.container}>
        <View style={styles.content}>
          <TextInput
            style={styles.textInput}
            placeholder="Nội dung thay đổi"
            multiline
          />
          <IconButton
            icon="check"
            size={32}
            style={styles.saveButton}
            containerColor="#d32f2f"
            iconColor="#fff"
            onPress={() => {}}
          />
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: 16 },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  saveButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#d32f2f',
  },
});
