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
