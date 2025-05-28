import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';

export const EditorScreen = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Edit: ##########" color="#fff" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#d32f2f' },
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
