import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const WIKI_API_URL = 'https://wiki.thdcybersecurity.com/lib/exe/xmlrpc.php';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export const xmlRpcClient = {
  async call(method: string, params: any[] = []) {
    const xmlParams = params.map(param =>
      `<param><value><string>${param}</string></value></param>`
    ).join('');
    const xmlRequest = `<?xml version="1.0"?>
      <methodCall>
        <methodName>${method}</methodName>
        <params>${xmlParams}</params>
      </methodCall>`;
    const response = await axios.post(WIKI_API_URL, xmlRequest, {
      headers: { 'Content-Type': 'text/xml' },
    });
    const parsed = xmlParser.parse(response.data);
    // Trả về value chính nếu có, hoặc toàn bộ object nếu không
    if (parsed.methodResponse?.params?.param?.value) {
      // Có thể là string, struct, array...
      const value = parsed.methodResponse.params.param.value;
      // Nếu là string
      if (typeof value === 'string') return value;
      // Nếu là struct/array
      if (value.struct || value.array) return value.struct || value.array;
      return value;
    }
    throw new Error('Invalid XML-RPC response');
  },
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const xmlRequest = `<?xml version="1.0"?>
        <methodCall>
          <methodName>dokuwiki.login</methodName>
          <params>
            <param><value><string>${username}</string></value></param>
            <param><value><string>${password}</string></value></param>
          </params>
        </methodCall>`;

      const response = await axios.post(WIKI_API_URL, xmlRequest, {
        headers: {
          'Content-Type': 'text/xml',
        },
      });

      const parsedResponse = xmlParser.parse(response.data);
      
      if (parsedResponse.methodResponse?.params?.param?.value?.string) {
        return {
          success: true,
          token: parsedResponse.methodResponse.params.param.value.string,
        };
      }

      return {
        success: false,
        error: 'Invalid response format',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
};
