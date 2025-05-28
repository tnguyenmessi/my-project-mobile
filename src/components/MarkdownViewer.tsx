import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

interface MarkdownViewerProps {
  html: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ html }) => {
  const { width } = useWindowDimensions();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <RenderHtml
        contentWidth={width - 32}
        source={{ html }}
        enableExperimentalMarginCollapsing
      />
    </ScrollView>
  );
};

export default MarkdownViewer;
