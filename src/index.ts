import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SupprClient } from './client.js';

// Export SupprClient for direct usage
export { SupprClient } from './client.js';

/**
 * Suppr MCP Server
 * AI-powered document translation and literature search service
 */

// Get API key from environment
const API_KEY = process.env.SUPPR_API_KEY;

if (!API_KEY) {
  console.error('Error: SUPPR_API_KEY environment variable is required');
  console.error('Please set it before running: export SUPPR_API_KEY=your_api_key');
  process.exit(1);
}

// Create Suppr API client
const supprClient = new SupprClient(API_KEY);

// Create MCP server using high-level API
const server = new McpServer({
  name: 'suppr-mcp',
  version: '1.1.6',
});

// Register document translation tools
server.registerTool(
  'create_translation',
  {
    title: 'Create Translation Task',
    description: 'Create a document translation task. Supports file upload via path or URL.',
    inputSchema: {
      file_path: z.string().optional().describe('Local file path to translate (mutually exclusive with file_url)'),
      file_url: z.string().optional().describe('Document URL to translate (mutually exclusive with file_path)'),
      from_lang: z.string().optional().describe('Source language code (optional, auto-detect if not specified)'),
      to_lang: z.string().describe('Target language code (required), e.g., en, zh, ko, ja'),
      optimize_math_formula: z.boolean().optional().describe('Optimize math formulas (PDF only)'),
    },
  },
  async ({ file_path, file_url, from_lang, to_lang, optimize_math_formula }) => {
    try {
      const result = await supprClient.createTranslation({
        file_path,
        file_url,
        from_lang,
        to_lang,
        optimize_math_formula,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.registerTool(
  'get_translation',
  {
    title: 'Get Translation Status',
    description: 'Get translation task details and status. Use this to check progress and get result URLs.',
    inputSchema: {
      task_id: z.string().describe('Translation task ID'),
    },
  },
  async ({ task_id }) => {
    try {
      const result = await supprClient.getTranslation(task_id);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.registerTool(
  'list_translations',
  {
    title: 'List Translation Tasks',
    description: 'List translation tasks with pagination. View all historical translation tasks.',
    inputSchema: {
      offset: z.number().optional().describe('Pagination offset (default: 0)'),
      limit: z.number().optional().describe('Results per page (default: 20)'),
    },
  },
  async ({ offset, limit }) => {
    try {
      const result = await supprClient.listTranslations({
        offset,
        limit,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register literature search tool
server.registerTool(
  'search_documents',
  {
    title: 'Search Academic Literature',
    description: 'AI-driven semantic search for academic literature. Input natural language query to find relevant papers.',
    inputSchema: {
      query: z.string().describe('Natural language query, e.g., "latest diabetes research"'),
      topk: z.number().optional().describe('Max results to return (1-100, default: 20)'),
      return_doc_keys: z.array(z.string()).optional().describe('Specific fields to return, e.g., ["title", "abstract", "doi"]'),
      auto_select: z.boolean().optional().describe('Auto-select best results (default: true)'),
    },
  },
  async ({ query, topk, return_doc_keys, auto_select }) => {
    try {
      const result = await supprClient.searchDocuments({
        query,
        topk,
        return_doc_keys,
        auto_select,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Suppr MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
