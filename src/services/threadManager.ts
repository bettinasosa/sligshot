import {openAIClient} from "@/lib/openaiClient";import Logger from "@/utils/logger";class ThreadManager {    constructor() {}    async createThread(initialMessage: string, vectorStoreId: string): Promise<string> {        try {            const thread = await openAIClient.client.beta.threads.create({                messages: [                    {                        role: 'user',                        content: initialMessage,                    },                ],                tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } },            });            Logger.log(`Thread created with ID: ${thread.id}`);            return thread.id;        } catch (error) {            Logger.error('Failed to create thread', error);            throw new Error('Unable to create thread');        }    }    async addMessage(threadId: string, role: "user" | "assistant", content: string): Promise<void> {        try {            await openAIClient.client.beta.threads.messages.create(threadId, {                role,                content,            });            Logger.log(`Message added to thread ${threadId} by ${role}`);        } catch (error) {            Logger.error(`Failed to add message to thread ${threadId}`, error);            throw new Error('Unable to add message to thread');        }    }    async getMessages(threadId: string, runId?: string): Promise<any[]> {        try {            const params = runId ? { run_id: runId } : {};            const messages = await openAIClient.client.beta.threads.messages.list(threadId, params);            return messages.data;        } catch (error) {            Logger.error(`Failed to retrieve messages from thread ${threadId}`, error);            throw new Error('Unable to retrieve messages');        }    }    async updateThreadWithVectorStore(threadId: string, vectorStoreId: string): Promise<void> {        try {            await openAIClient.client.beta.threads.update(threadId, {                tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } },            });            Logger.log(`Thread ${threadId} updated with vector store ${vectorStoreId}`);        } catch (error) {            Logger.error(`Failed to update thread ${threadId} with vector store`, error);            throw new Error('Unable to update thread with vector store');        }    }    async getMessageCount(threadId: string): Promise<number> {        const messages = await openAIClient.client.beta.threads.messages.list(threadId);        return messages.data.length;    }}export default ThreadManager;