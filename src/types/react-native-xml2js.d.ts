declare module 'react-native-xml2js' {
  export function parseString(xml: string, options?: any): Promise<any>;
  export function parseStringSync(xml: string, options?: any): any;
}