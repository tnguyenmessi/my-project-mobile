import { parseString as parseStringCallback } from 'react-native-xml2js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIKI_URL = 'https://wiki.thdcybersecurity.com/lib/exe/xmlrpc.php';

const parseString = (xml: string, options?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        parseStringCallback(xml, options || {}, (err: any, result: any) => {
            if (err) {
                console.error("XML Parsing Error:", err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const paramToXml = (param: any): string => {
    if (typeof param === 'string') {
        return `<string>${param.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</string>`;
    }
    if (typeof param === 'number') {
        return `<int>${param}</int>`;
    }
    if (typeof param === 'boolean') {
        return `<boolean>${param ? '1' : '0'}</boolean>`;
    }
    if (Array.isArray(param)) {
        const items = param.map(item => `<value>${paramToXml(item)}</value>`).join('');
        return `<array><data>${items}</data></array>`;
    }
    if (typeof param === 'object' && param !== null) {
       const members = Object.keys(param).map(key =>
           `<member><name>${key}</name><value>${paramToXml(param[key])}</value></member>`
       ).join('');
       return `<struct>${members}</struct>`;
    }
    return `<string>${String(param).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</string>`;
};

const buildXmlRequest = (methodName: string, params: any[]): string => {
    const paramsXml = params.map(param => `<param><value>${paramToXml(param)}</value></param>`).join('');
    return `<?xml version="1.0"?>
<methodCall>
  <methodName>${methodName}</methodName>
  <params>${paramsXml}</params>
</methodCall>`;
};


const callApi = async (methodName: string, params: any[]): Promise<any> => {
    const xmlBody = buildXmlRequest(methodName, params);
    console.log(`[${methodName}] Request XML:`, xmlBody);

    const headers: Record<string, string> = {
        'Content-Type': 'text/xml',
        'Accept': 'text/xml',
    };

    const storedCookie = await AsyncStorage.getItem('sessionCookie');
    if (storedCookie) {
        headers['Cookie'] = storedCookie;
        console.log(`[${methodName}] Sending with Cookie:`, storedCookie);
    } else {
         console.log(`[${methodName}] Sending without Cookie.`);
    }

    try {
        const response = await fetch(WIKI_URL, {
            method: 'POST',
            headers: headers,
            body: xmlBody,
        });

        console.log(`[${methodName}] Response Status:`, response.status);
        console.log(`[${methodName}] Response Headers:`, JSON.stringify(response.headers));

        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            const match = setCookieHeader.match(/(DokuWiki=[^;]+)/);
            if (match && match[1]) {
                const newCookie = match[1];
                const currentCookie = await AsyncStorage.getItem('sessionCookie');
                if (newCookie !== currentCookie) {
                   await AsyncStorage.setItem('sessionCookie', newCookie);
                   console.log(`[${methodName}] Stored new/updated cookie:`, newCookie);
                }
            } else {
                 console.warn(`[${methodName}] Could not parse DokuWiki cookie from:`, setCookieHeader);
            }
        }

        const xmlResponse = await response.text();
        console.log(`[${methodName}] Raw XML Response:`, xmlResponse);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}. Response: ${xmlResponse.substring(0, 500)}...`);
        }

        if (!xmlResponse || !xmlResponse.trim().startsWith('<?xml')) {
            console.error(`[${methodName}] Non-XML response received:`, xmlResponse);
            if (xmlResponse.toLowerCase().includes('<form') && xmlResponse.toLowerCase().includes('login')) {
                 throw new Error("Server trả về trang đăng nhập. Có thể bạn chưa đăng nhập hoặc cookie đã hết hạn.");
            }
            throw new Error("Server trả về không phải XML (có thể bạn chưa đăng nhập hoặc server lỗi)");
        }

        const result = await parseString(xmlResponse, { explicitArray: false, trim: true });
        console.log(`[${methodName}] Parsed Response:`, JSON.stringify(result));

        if (!result || !result.methodResponse) {
            console.error(`[${methodName}] Malformed or empty XML-RPC response:`, xmlResponse);
            throw new Error(`Malformed or empty XML-RPC response for ${methodName}`);
        }

        if (result.methodResponse.fault) {
             const fault = result.methodResponse.fault.value.struct;
             const codeMember = fault.member.find((m: any) => m.name === 'faultCode');
             const stringMember = fault.member.find((m: any) => m.name === 'faultString');
             const faultCode = codeMember ? (codeMember.value.int || codeMember.value.string) : 'Unknown';
             const faultString = stringMember ? stringMember.value.string : 'Unknown error';
             console.error(`[${methodName}] XML-RPC Fault: Code=${faultCode}, String=${faultString}`, fault);
             throw new Error(`XML-RPC Error: ${faultString} (Code: ${faultCode})`);
        }

        if (result.methodResponse.params && result.methodResponse.params.param) {
            return result.methodResponse.params.param.value;
        } else if (result.methodResponse.params) {
            return true;
        }

        console.warn(`[${methodName}] Response without params or fault. Assuming success.`, result);
        return true;

    } catch (error) {
        console.error(`[${methodName}] API Call Error:`, error);
        throw error;
    }
};

export const dokuwikiLogin = async (username: string, password: string): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem('sessionCookie');
        console.log("Cleared old session cookie before login.");

        const result = await callApi('dokuwiki.login', [username, password]);
        console.log("Login result raw:", JSON.stringify(result));

        const loginSuccess = result && result.boolean === '1';

        if (loginSuccess) {
            console.log("Login successful!");
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('username', username);
            return true;
        } else {
            console.warn("Login attempt returned non-success value:", result);
            throw new Error("Đăng nhập không thành công. Sai tên đăng nhập hoặc mật khẩu?");
        }
    } catch (error) {
        console.error("Login process failed:", error);
        await AsyncStorage.removeItem('sessionCookie');
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('username');
        return false;
    }
};

export const dokuwikiLogoff = async (): Promise<void> => {
     try {
        await callApi('dokuwiki.logoff', []);
        console.log("Logoff successful.");
     } catch(e) {
        console.warn("Error during logoff (ignoring):", e);
     }
     await AsyncStorage.removeItem('sessionCookie');
     await AsyncStorage.removeItem('isLoggedIn');
     await AsyncStorage.removeItem('username');
     console.log("Cleared session data after logoff.");
};

export const getPage = async (pageId: string): Promise<string> => {
    try {
        const result = await callApi('wiki.getPage', [pageId]);
        return result.string || '';
    } catch (error) {
        console.error(`Failed to get Page ${pageId}:`, error);
        throw error;
    }
};

export const getPageHTML = async (pageId: string): Promise<string> => {
    try {
        const result = await callApi('wiki.getPageHTML', [pageId]);
        return result.string || '';
    } catch (error) {
         console.error(`Failed to get HTML for ${pageId}:`, error);
         try {
            console.log(`Falling back to getPage for ${pageId}`);
            const rawText = await getPage(pageId);
            const escapedText = rawText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
            return `<p><i>(Không thể tải HTML, hiển thị nội dung gốc)</i></p><pre>${escapedText}</pre>`;
         } catch (fallbackError) {
             console.error(`Fallback failed for ${pageId}:`, fallbackError);
             return `<p><b>Lỗi: Không thể tải trang '${pageId}'.</b></p>`;
         }
    }
};

export const putPage = async (pageId: string, content: string, summary: string = ''): Promise<boolean> => {
    try {
        const result = await callApi('wiki.putPage', [pageId, content, { sum: summary }]);
        return result === true || (result && result.boolean === '1');
    } catch (error) {
        console.error(`Failed to put Page ${pageId}:`, error);
        return false;
    }
};

export const search = async (query: string): Promise<any[]> => {
    try {
        const result = await callApi('dokuwiki.search', [query]);
        console.log("Search result raw:", JSON.stringify(result));

        if (result && result.array && result.array.data) {
           let values = result.array.data.value;

           if (!values) return [];

           if (!Array.isArray(values)) {
               values = [values];
           }

           return values.map((item: any) => {
               if (!item.struct || !item.struct.member) {
                   console.warn("Found non-struct item in search result:", item);
                   return {};
               }

               let members = item.struct.member;
               if (!Array.isArray(members)) {
                   members = [members];
               }

               return members.reduce((acc: Record<string, any>, member: any) => {
                   const valueKey = Object.keys(member.value)[0];
                   acc[member.name] = member.value[valueKey];
                   return acc;
               }, {});
           });
        }
        return [];
    } catch (error) {
        console.error(`Search failed for query "${query}":`, error);
        return [];
    }
};
// lay PageList de tao namespace id
export const getPagelist = async (namespace = '.', depth = 50): Promise<any[]> => {
    try {
        console.log(`[getPagelist] Calling for namespace: ${namespace}, depth: ${depth}`);
        // Thay wiki.getPagelist bằng wiki.getAllPages
        const result = await callApi('wiki.getAllPages', []);
        console.log(`[getPagelist] Raw result for ${namespace}:`, JSON.stringify(result));
        
        if (result && result.array && result.array.data) {
            let values = result.array.data.value;
            if (!values) {
                console.warn(`[getPagelist] No pages found for namespace: ${namespace}`);
                return [];
            }
            if (!Array.isArray(values)) values = [values];
            
            const pageList = values.map((item: any) => {
                if (!item.struct || !item.struct.member) {
                    console.warn(`[getPagelist] Invalid page item:`, item);
                    return {};
                }
                let members = item.struct.member;
                if (!Array.isArray(members)) members = [members];
                return members.reduce((acc: Record<string, any>, member: any) => {
                    const valueKey = Object.keys(member.value)[0];
                    acc[member.name] = member.value[valueKey];
                    return acc;
                }, {});
            });
            // Lọc trang theo namespace nếu cần
            const filteredPages = pageList.filter((page: any) => 
                page.id && (namespace === '.' || page.id.startsWith(namespace + ':'))
            );
            console.log(`[getPagelist] Processed pages for ${namespace}:`, filteredPages);
            return filteredPages;
        }
        console.warn(`[getPagelist] No data in response for ${namespace}`);
        return [];
    } catch (error) {
        console.error(`[getPagelist] Failed for namespace ${namespace}:`, error);
        return [];
    }
};
// Lấy danh sách tất cả namespaces từ root namespace
export const getNamespaces = async (): Promise<string[]> => {
    try {
        const pages = await getPagelist('.');
        console.log('📜 Pages from getPagelist:', pages);

        const namespaces = new Set<string>();
        pages.forEach((page: any) => {
            if (page.id && typeof page.id === 'string') {
                console.log('Processing page ID:', page.id);
                const parts = page.id.split(':');
                parts.pop(); // Bỏ phần tên trang
                const ns = parts.join(':');
                if (ns) {
                    console.log('Found namespace:', ns);
                    namespaces.add(ns);
                }
            } else {
                console.warn('Invalid page ID:', page);
            }
        });

        const namespaceList = Array.from(namespaces);
        console.log('🌟 Final namespaces:', namespaceList);
        if (namespaceList.length === 0) {
            console.warn('No namespaces found, server may be empty or access restricted');
        }
        return namespaceList;
    } catch (error) {
        console.error('Failed to get namespaces:', error);
        return [];
    }
};