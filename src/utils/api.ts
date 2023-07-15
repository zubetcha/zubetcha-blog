import axios from 'axios';

const api = axios.create({});

const getPosts = async () => {
  const response = await api.get('/api/hello');

  return response.data;
};

const getPostDetail = async (id: string) => {
  const response = await api.get(`/api/post/${id}`);

  return response.data;
};

export { getPosts, getPostDetail };
