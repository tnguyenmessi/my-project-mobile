import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

interface MarkdownViewerProps {
  html: string;
}

// Hàm tự động nối domain cho ảnh nếu là đường dẫn tương đối
function fixImageSrc(html: string): string {
  const domain = 'https://wiki.thdcybersecurity.com';
  return html.replace(
    /<img([^>]*?)src=["'](\/[^"'>]+)["']/g,
    (match, pre, src) => {
      // Nếu src đã là absolute (http/https) thì giữ nguyên
      if (/^https?:\/\//.test(src)) return match;
      return `<img${pre}src="${domain}${src}"`;
    },
  );
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ html }) => {
  const { width } = useWindowDimensions();
  const fixedHtml = fixImageSrc(html);
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <RenderHtml
        contentWidth={width - 32}
        source={{ html: fixedHtml }}
        baseStyle={{ color: '#222', fontSize: 16 }}
        tagsStyles={{
          img: { maxWidth: '100%', height: 'auto', marginVertical: 8 },
          table: {
            borderWidth: 1,
            borderColor: '#ccc',
            width: '100%',
            marginVertical: 8,
          },
          th: {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 4,
          },
          td: { borderWidth: 1, borderColor: '#ccc', padding: 4 },
        }}
        enableExperimentalMarginCollapsing
        enableExperimentalBRCollapsing={true}
      />
    </ScrollView>
  );
};

export default MarkdownViewer;
