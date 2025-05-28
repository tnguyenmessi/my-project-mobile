import { xmlRpcClient } from './xmlRpcClient';

export interface Page {
  id: string;
  title: string;
  namespace: string;
  lastModified: string;
  size: number;
}

export interface PageContent {
  content: string;
  html: string;
  lastModified: string;
}

// Helper để chuyển mọi kiểu dữ liệu XML-RPC về string an toàn
function extractString(val: any): string {
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.join('');
  if (val && typeof val === 'object') {
    if (typeof val.string === 'string') return val.string;
    if (Array.isArray(val.string)) return val.string.join('');
    return JSON.stringify(val);
  }
  return '';
}

// Chuyển danh sách page phẳng thành cây namespace-page
export interface PageTreeNode {
  id?: string; // id của page nếu là leaf
  title?: string;
  children: { [key: string]: PageTreeNode };
  isPage?: boolean;
}

export function buildPageTree(pages: Page[]): PageTreeNode {
  const root: PageTreeNode = { children: {} };
  pages.forEach(page => {
    const parts = page.id.split(':');
    let node = root;
    parts.forEach((part, idx) => {
      if (!node.children[part]) {
        node.children[part] = { children: {} };
      }
      if (idx === parts.length - 1) {
        node.children[part].id = page.id;
        node.children[part].title = page.title || part;
        node.children[part].isPage = true;
      }
      node = node.children[part];
    });
  });
  return root;
}

// Helper để parse struct/member từ XML-RPC thành object phẳng
function parseXmlRpcStruct(structObj: any): any {
  const obj: any = {};
  if (structObj && Array.isArray(structObj.member)) {
    structObj.member.forEach((m: any) => {
      const valObj = m.value;
      if (valObj.string !== undefined) obj[m.name] = valObj.string;
      else if (valObj.int !== undefined) obj[m.name] = valObj.int;
      else obj[m.name] = valObj; // fallback
    });
  }
  return obj;
}

export class PageService {
  private static instance: PageService;

  private constructor() {}

  static getInstance(): PageService {
    if (!PageService.instance) {
      PageService.instance = new PageService();
    }
    return PageService.instance;
  }

  async getPageList(namespace: string = ''): Promise<Page[]> {
    try {
      const result = await xmlRpcClient.call('dokuwiki.getPagelist', [namespace, {}]);
      const rawPages = result?.data?.value;
      if (!Array.isArray(rawPages)) {
        console.error('getPagelist: rawPages is not array', result);
        return [];
      }
      return rawPages.map((item: any) => {
        const page = parseXmlRpcStruct(item.struct);
        return {
          id: page.id,
          title: page.id?.split(':').pop() || page.id,
          namespace: page.id?.split(':').slice(0, -1).join(':') || '',
          lastModified: page.mtime ? String(page.mtime) : '',
          size: page.size || 0,
        };
      });
    } catch (error) {
      console.error('Failed to get page list:', error);
      throw error;
    }
  }

  async getPageContent(pageId: string): Promise<PageContent> {
    try {
      const [contentRaw, htmlRaw, lastModifiedRaw] = await Promise.all([
        xmlRpcClient.call('wiki.getPage', [pageId]),
        xmlRpcClient.call('wiki.getPageHTML', [pageId]),
        xmlRpcClient.call('wiki.getPageInfo', [pageId]),
      ]);
      const content = extractString(contentRaw);
      const html = extractString(htmlRaw);
      const lastModified = lastModifiedRaw?.lastModified || '';
      return {
        content,
        html,
        lastModified,
      };
    } catch (error) {
      console.error('Failed to get page content:', error);
      throw error;
    }
  }

  async putPage(pageId: string, content: string, summary: string): Promise<boolean> {
    try {
      if (summary.length > 200) {
        throw new Error('Summary must not exceed 200 characters');
      }

      const result = await xmlRpcClient.call('wiki.putPage', [pageId, content, { summary }]);
      return result;
    } catch (error) {
      console.error('Failed to update page:', error);
      throw error;
    }
  }

  async search(query: string): Promise<Page[]> {
    try {
      const result = await xmlRpcClient.call('wiki.search', [query]);
      return result.map((page: any) => ({
        id: page.id,
        title: page.title,
        namespace: page.namespace,
        lastModified: page.lastModified,
        size: page.size,
      }));
    } catch (error) {
      console.error('Failed to search pages:', error);
      throw error;
    }
  }

  async searchPages(query: string): Promise<{id: string, title: string}[]> {
    try {
      const results = await this.search(query);
      return results.map((item: any) => ({ id: item.id, title: item.title || item.id }));
    } catch (e) {
      // Fallback: lấy toàn bộ page rồi filter client
      const allPages = await this.getPageList('');
      const q = query.toLowerCase();
      return allPages.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q))
      ).map(p => ({ id: p.id, title: p.title || p.id }));
    }
  }

  async getRecentChanges(since: number = 0): Promise<any[]> {
    try {
      const result = await xmlRpcClient.call('wiki.getRecentChanges', [since]);
      console.log('RecentChanges result:', result);
      if (!Array.isArray(result)) {
        throw new Error('Server trả về không phải mảng. Có thể bạn chưa đủ quyền hoặc server chưa bật XML-RPC.');
      }
      return result.map((item: any) => ({
        id: item.id,
        user: item.user,
        type: item.type,
        timestamp: item.timestamp,
        summary: item.summary,
      }));
    } catch (e) {
      console.error('Failed to get recent changes:', e);
      return [];
    }
  }
}

export const pageService = PageService.getInstance();
