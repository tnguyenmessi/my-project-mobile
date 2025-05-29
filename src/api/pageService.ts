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

  private contentCache: Map<string, {content: string; timestamp: number}> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 phút
  private readonly MAX_PAGES_TO_SEARCH = 50; // Giới hạn số trang tìm kiếm

  private async getPageContentWithCache(pageId: string): Promise<PageContent> {
    const now = Date.now();
    const cached = this.contentCache.get(pageId);
    
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return { content: cached.content, html: '', lastModified: '' };
    }

    const content = await this.getPageContent(pageId);
    this.contentCache.set(pageId, {
      content: content.content,
      timestamp: now
    });
    return content;
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

  async search(query: string): Promise<SearchResult[]> {
    try {
      console.log('Bắt đầu tìm kiếm với từ khóa:', query);
      
      // Tìm kiếm song song cả trong title và content
      const [titleResults, contentResults] = await Promise.all([
        // Tìm trong title
        this.searchByTitle(query),
        // Tìm trong content
        this.searchInContent(query)
      ]);

      // Kết hợp kết quả, loại bỏ trùng lặp
      const results = [...titleResults];
      for (const contentResult of contentResults) {
        if (!results.some(r => r.id === contentResult.id)) {
          results.push(contentResult);
        }
      }

      console.log('Số kết quả tìm thấy:', results.length);
      return results;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      return [];
    }
  }

  private async searchByTitle(query: string): Promise<SearchResult[]> {
    try {
      // Tìm kiếm theo title sử dụng getPagelist
      const allPages = await this.getPageList('');
      const q = query.toLowerCase();
      
      return allPages
        .filter(page => 
          page.title?.toLowerCase().includes(q) || 
          page.id?.toLowerCase().includes(q)
        )
        .map(page => ({
          ...page,
          matchType: 'title',
          snippet: ''
        }));
    } catch (error) {
      console.error('Lỗi khi tìm theo title:', error);
      return [];
    }
  }

  private async searchInContent(query: string): Promise<SearchResult[]> {
    try {
      // Lấy danh sách tất cả các trang và sắp xếp theo thời gian sửa đổi
      const allPages = await this.getPageList('');
      const sortedPages = allPages
        .sort((a, b) => (b.lastModified || '').localeCompare(a.lastModified || ''))
        .slice(0, this.MAX_PAGES_TO_SEARCH); // Chỉ tìm trong MAX_PAGES_TO_SEARCH trang mới nhất

      const results: SearchResult[] = [];
      const processedIds = new Set<string>();
      const q = query.toLowerCase();

      // Xử lý song song theo batch để tối ưu tốc độ
      const batchSize = 15; // Tăng batch size
      for (let i = 0; i < sortedPages.length; i += batchSize) {
        const batch = sortedPages.slice(i, i + batchSize);
        const batchPromises = batch.map(async page => {
          try {
            if (processedIds.has(page.id)) return null;
            processedIds.add(page.id);

            // Lấy nội dung trang từ cache hoặc API
            const content = await this.getPageContentWithCache(page.id);
            const contentLower = content.content.toLowerCase();
            const matchIndex = contentLower.indexOf(q);

            if (matchIndex === -1) return null;

            // Tạo snippet từ vị trí tìm thấy
            const snippetStart = Math.max(0, matchIndex - 50);
            const snippetEnd = Math.min(
              content.content.length,
              matchIndex + query.length + 50
            );
            const snippet = content.content
              .slice(snippetStart, snippetEnd)
              .replace(/\n/g, ' ')
              .trim();

            return {
              id: page.id,
              title: page.title || page.id.split(':').pop() || page.id,
              namespace: page.id.split(':').slice(0, -1).join(':') || '',
              lastModified: page.lastModified || '',
              size: page.size || 0,
              matchType: 'content',
              snippet: `...${snippet}...`
            };
          } catch (err) {
            console.error(`Lỗi khi tìm kiếm trong trang ${page.id}:`, err);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter((r): r is SearchResult => r !== null);
        results.push(...validResults);

        // Log tiến độ tìm kiếm
        const progress = Math.min(i + batchSize, sortedPages.length);
        console.log(`Đã tìm kiếm ${progress}/${sortedPages.length} trang, tìm thấy ${results.length} kết quả`);
      }

      return results;
    } catch (error) {
      console.error('Lỗi khi tìm trong nội dung:', error);
      return [];
    }
  }

  async searchPages(query: string): Promise<{id: string; title: string; snippet?: string}[]> {
    try {
      const results = await this.search(query);
      return results.map(item => ({
        id: item.id,
        title: item.title || item.id,
        snippet: item.snippet
      }));
    } catch (e) {
      // Fallback: lấy toàn bộ page rồi filter client
      const allPages = await this.getPageList('');
      const q = query.toLowerCase();
      return allPages
        .filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.id && p.id.toLowerCase().includes(q))
        )
        .map(p => ({
          id: p.id,
          title: p.title || p.id
        }));
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

  async getNamespaces(): Promise<string[]> {
    // Lấy toàn bộ page, trích xuất namespace, loại trùng, trả về mảng string
    const pages = await this.getPageList('');
    const namespaces = new Set<string>();
    pages.forEach(page => {
      if (page.namespace) namespaces.add(page.namespace);
    });
    return Array.from(namespaces).sort();
  }
}

export const pageService = PageService.getInstance();
