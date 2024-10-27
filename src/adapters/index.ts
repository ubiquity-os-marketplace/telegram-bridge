import { Context } from "../types";
import { SessionManagerFactory } from "../bot/mtproto-api/bot/session/session-manager";
import { UserBaseStorage, ChatAction, HandleChatParams, StorageTypes, RetrievalHelper, Chat } from "../types/storage";

export interface Storage {
  userSnapshot(chatId: number, userIds: number[]): Promise<void>;
  updateChatStatus(status: "open" | "closed" | "reopened", taskNodeId?: string, chatId?: number): Promise<void>;
  saveChat(chatId: number, chatName: string, taskNodeId: string): Promise<void>;
  retrieveChatByChatId(chatId: number): Promise<Chat | undefined>;
  retrieveChatByTaskNodeId(taskNodeId: string): Promise<Chat | undefined>;
  retrieveUserByTelegramId(telegramId: number, dbObj?: UserBaseStorage): Promise<UserBaseStorage | undefined>;
  retrieveUserByGithubId(githubId: number | null | undefined, dbObj?: UserBaseStorage): Promise<UserBaseStorage | undefined>;
  retrieveSession(): Promise<string | null>;
  handleChat<TAction extends ChatAction>(params: HandleChatParams<TAction>): Promise<void>;
  handleSession<TAction extends "create" | "delete">(session: string, action: TAction): Promise<void>;
  handleUserBaseStorage<TType extends "create" | "delete" | "update">(user: UserBaseStorage, action: TType): Promise<boolean>;
  storeData<TType extends StorageTypes>(data: RetrievalHelper<TType> | null, idToDelete?: number): Promise<boolean>;
}

export function createAdapters(ctx: Context) {
  const {
    config: { shouldUseGithubStorage },
  } = ctx;
  return {
    storage: SessionManagerFactory.createSessionManager(shouldUseGithubStorage, ctx).storage,
  };
}
