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
      return result.map((page: any) => ({
        id: page.id,
        title: page.title,
        namespace: page.namespace,
        lastModified: page.lastModified,
        size: page.size,
      }));
    } catch (error) {
      console.error('Failed to get page list:', error);
      throw error;
    }
  }

  async getPageContent(pageId: string): Promise<PageContent> {
    try {
      const [content, html, lastModified] = await Promise.all([
        xmlRpcClient.call('wiki.getPage', [pageId]),
        xmlRpcClient.call('wiki.getPageHTML', [pageId]),
        xmlRpcClient.call('wiki.getPageInfo', [pageId]),
      ]);

      return {
        content,
        html,
        lastModified: lastModified.lastModified,
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
}

export const pageService = PageService.getInstance();
