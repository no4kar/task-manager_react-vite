import { TyTodo } from '../types/Todo.type';
import { getClient, onReq, onRes } from '../utils/axios.client';
import { env } from '../constants/varsFromEnv';
import { authApi } from './auth.api';

const client = getClient({
  baseURL: `${env.API_URL}/todos`,
});

export const todosApi = {
  async getAll(
    query: TyTodo.Request.GetAll,
  ) {
    const params: {
      taskId: string,
      title?: string,
      completed?: string,
      page: string,
      size: string,
    } = {
      taskId: query.taskId,
      page: (query.page && query.page > 1)
        ? String(query.page)
        : '1',
      size: (query.size && query.size > 0)
        ? String(query.size)
        : '100',
    };

    if (query.title) {
      params.title = query.title;
    }

    if (query.completed) {
      params.completed = String(query.completed);
    }

    return client.get('', { params })
      .then<TyTodo.Response.GetAll>(onRes.obtainData);
  },

  async create(props: TyTodo.Request.Create) {
    return client.post('', props)
      .then<TyTodo.Response.Create>(onRes.obtainData);
  },

  async remove(todoId: TyTodo.Item['id']) {
    return client.delete(`/${todoId}`)
      .then<TyTodo.Item['id']>(() => todoId);
  },

  async update(updatedItem: TyTodo.Request.Update) {
    const updatedProps: TyTodo.Request.UpdateProps = {
      userId: updatedItem.userId,
      title: updatedItem.title,
      completed: updatedItem.completed,
    };

    if (updatedItem.image) {
      updatedProps.image = updatedItem.image;
    }

    return client.put(
      `/${updatedItem.id}`,
      updatedProps, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then<TyTodo.Response.Update>(onRes.obtainData);
  },
};

client.interceptors.request.use(onReq.stickAccessToken);
client.interceptors.response.use(
  onRes.toConsoleInfo,
  onRes.handleUnauthorizedError(client, authApi.refresh));
